import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "../client";
import { studentCalculatorResults } from "../schema";

export type TestPrepExamFilter = "all" | "sat" | "act";
export const TEST_PREP_PAGE_SIZE = 15;
export const TEST_PREP_EXPORT_LIMIT = 1000;

function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/** All query inputs are untrusted; date boundaries are inclusive UTC calendar dates. */
export function normalizeTestPrepHistoryQuery(input: { exam?: string; page?: string; from?: string; to?: string }) {
  const exam: TestPrepExamFilter = input.exam === "sat" || input.exam === "act" ? input.exam : "all";
  const raw = input.page ?? "1";
  const page = /^\d{1,5}$/.test(raw) ? Math.max(1, Math.min(1000, Number(raw))) : 1;
  const from = validDate(input.from) ? input.from : undefined;
  const to = validDate(input.to) ? input.to : undefined;
  return from && to && from > to ? { exam, page, from: undefined, to: undefined } : { exam, page, from, to };
}

type HistoryQuery = ReturnType<typeof normalizeTestPrepHistoryQuery>;

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
  input: { exam?: string; page?: string; from?: string; to?: string } = {},
) {
  const query = normalizeTestPrepHistoryQuery(input);
  const ownership = historyWhere(userId, query);
  const [countRows] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(studentCalculatorResults).where(ownership),
  ]);
  const total = countRows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / TEST_PREP_PAGE_SIZE));
  const page = Math.min(query.page, totalPages);
  const rows = await db.select(historyFields).from(studentCalculatorResults).where(ownership)
    .orderBy(desc(studentCalculatorResults.createdAt), desc(studentCalculatorResults.id))
    .limit(TEST_PREP_PAGE_SIZE).offset((page - 1) * TEST_PREP_PAGE_SIZE);
  return { ...query, page, pageSize: TEST_PREP_PAGE_SIZE, total, totalPages, rows };
}

/** Export is capped to avoid unbounded downloads; all filters are applied in SQL. */
export async function getStudentTestPrepExport(
  userId: string,
  input: { exam?: string; from?: string; to?: string } = {},
) {
  const query = normalizeTestPrepHistoryQuery(input);
  return db.select(historyFields).from(studentCalculatorResults).where(historyWhere(userId, query))
    .orderBy(desc(studentCalculatorResults.createdAt), desc(studentCalculatorResults.id))
    .limit(TEST_PREP_EXPORT_LIMIT);
}
