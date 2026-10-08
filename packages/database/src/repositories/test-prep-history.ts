import { and, asc, desc, eq, gte, ilike, lt, or, sql } from "drizzle-orm";
import { db } from "../client";
import { studentCalculatorResults } from "../schema";

export type TestPrepExamFilter = "all" | "sat" | "act";
export type TestPrepSort = "newest" | "oldest";
export const TEST_PREP_PAGE_SIZE = 15;
export const TEST_PREP_PAGE_SIZES = [15, 30, 50] as const;
export const TEST_PREP_EXPORT_LIMIT = 1000;
export const TEST_PREP_SEARCH_MAX_LENGTH = 80;

/** Escape LIKE wildcards so searches are literal substrings, not arbitrary SQL patterns. */
export function normalizeTestPrepSearch(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, TEST_PREP_SEARCH_MAX_LENGTH) : "";
}


function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/** All query inputs are untrusted; date boundaries are inclusive UTC calendar dates. */
export function normalizeTestPrepHistoryQuery(input: { exam?: string; page?: string; from?: string; to?: string; sort?: string; size?: string; q?: string }) {
  const q = normalizeTestPrepSearch(input.q);
  const pageSize = input.size === "30" ? 30 : input.size === "50" ? 50 : TEST_PREP_PAGE_SIZE;
  const sort: TestPrepSort = input.sort === "oldest" ? "oldest" : "newest";
  const exam: TestPrepExamFilter = input.exam === "sat" || input.exam === "act" ? input.exam : "all";
  const raw = input.page ?? "1";
  const page = /^\d{1,5}$/.test(raw) ? Math.max(1, Math.min(1000, Number(raw))) : 1;
  const from = validDate(input.from) ? input.from : undefined;
  const to = validDate(input.to) ? input.to : undefined;
  return from && to && from > to ? { exam, page, from: undefined, to: undefined, sort, pageSize, q } : { exam, page, from, to, sort, pageSize, q };
}

type HistoryQuery = ReturnType<typeof normalizeTestPrepHistoryQuery>;

/** Escape PostgreSQL LIKE metacharacters with a literal backslash. */
export function escapeTestPrepLike(value: string): string {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`);
}

function historyWhere(userId: string, query: HistoryQuery) {
  const examFilter = query.exam === "all"
    ? sql`${studentCalculatorResults.toolSlug} ~ '(^|-)(sat|act)(-|$)'`
    : query.exam === "sat"
      ? sql`${studentCalculatorResults.toolSlug} ~ '(^|-)sat(-|$)'`
      : sql`${studentCalculatorResults.toolSlug} ~ '(^|-)act(-|$)'`;
  return and(
    eq(studentCalculatorResults.userId, userId),
    eq(studentCalculatorResults.isSaved, true),
    examFilter,
    query.q ? or(
      ilike(studentCalculatorResults.toolName, `%${escapeTestPrepLike(query.q)}%`),
      ilike(studentCalculatorResults.summary, `%${escapeTestPrepLike(query.q)}%`),
    ) : undefined,
    query.from ? gte(studentCalculatorResults.createdAt, new Date(`${query.from}T00:00:00.000Z`)) : undefined,
    query.to ? lt(studentCalculatorResults.createdAt, new Date(Date.parse(`${query.to}T00:00:00.000Z`) + 86400000)) : undefined,
  );
}

const historyFields = {
  id: studentCalculatorResults.id,
  toolName: studentCalculatorResults.toolName,
  toolSlug: studentCalculatorResults.toolSlug,
  summary: studentCalculatorResults.summary,
  calculatorVersion: studentCalculatorResults.calculatorVersion,
  createdAt: studentCalculatorResults.createdAt,
};

/** A bounded, owner-scoped view of saved exam calculator outputs. */
export async function getStudentTestPrepHistory(
  userId: string,
  input: { exam?: string; page?: string; from?: string; to?: string; sort?: string; size?: string; q?: string } = {},
) {
  const query = normalizeTestPrepHistoryQuery(input);
  const ownership = historyWhere(userId, query);
  const [countRows] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(studentCalculatorResults).where(ownership),
  ]);
  const total = countRows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, totalPages);
  const order = query.sort === "oldest" ? asc : desc;
  const rows = await db.select(historyFields).from(studentCalculatorResults).where(ownership)
    .orderBy(order(studentCalculatorResults.createdAt), order(studentCalculatorResults.id))
    .limit(query.pageSize).offset((page - 1) * query.pageSize);
  return { ...query, page, total, totalPages, rows };
}

/** Export is capped to avoid unbounded downloads; all filters are applied in SQL. */
export async function getStudentTestPrepExport(
  userId: string,
  input: { exam?: string; from?: string; to?: string; sort?: string; q?: string } = {},
) {
  const query = normalizeTestPrepHistoryQuery(input);
  const order = query.sort === "oldest" ? asc : desc;
  return db.select(historyFields).from(studentCalculatorResults).where(historyWhere(userId, query))
    .orderBy(order(studentCalculatorResults.createdAt), order(studentCalculatorResults.id))
    .limit(TEST_PREP_EXPORT_LIMIT);
}
