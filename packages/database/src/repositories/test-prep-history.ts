import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../client";
import { studentCalculatorResults } from "../schema";

export type TestPrepExamFilter = "all" | "sat" | "act";
export const TEST_PREP_PAGE_SIZE = 15;

/** Bound pagination input before it reaches SQL; never trust URL parameters. */
export function normalizeTestPrepHistoryQuery(input: { exam?: string; page?: string }) {
  const exam: TestPrepExamFilter = input.exam === "sat" || input.exam === "act" ? input.exam : "all";
  const raw = input.page ?? "1";
  const page = /^\d{1,5}$/.test(raw) ? Math.max(1, Math.min(1000, Number(raw))) : 1;
  return { exam, page };
}

/** A bounded, owner-scoped view of saved exam calculator outputs. */
export async function getStudentTestPrepHistory(
  userId: string,
  input: { exam?: string; page?: string } = {},
) {
  const { exam, page } = normalizeTestPrepHistoryQuery(input);
  const examFilter = exam === "all"
    ? sql`${studentCalculatorResults.toolSlug} ~ '(^|-)(sat|act)(-|$)'`
    : exam === "sat"
      ? sql`${studentCalculatorResults.toolSlug} ~ '(^|-)sat(-|$)'`
      : sql`${studentCalculatorResults.toolSlug} ~ '(^|-)act(-|$)'`;
  const ownership = and(
    eq(studentCalculatorResults.userId, userId),
    eq(studentCalculatorResults.isSaved, true),
    examFilter,
  );
  const [countRows, rows] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` })
      .from(studentCalculatorResults).where(ownership),
    db.select({
      id: studentCalculatorResults.id,
      toolName: studentCalculatorResults.toolName,
      toolSlug: studentCalculatorResults.toolSlug,
      summary: studentCalculatorResults.summary,
      calculatorVersion: studentCalculatorResults.calculatorVersion,
      createdAt: studentCalculatorResults.createdAt,
    }).from(studentCalculatorResults).where(ownership)
      .orderBy(desc(studentCalculatorResults.createdAt), desc(studentCalculatorResults.id))
      .limit(TEST_PREP_PAGE_SIZE).offset((page - 1) * TEST_PREP_PAGE_SIZE),
  ]);
  const total = countRows[0]?.count ?? 0;
  return { exam, page, pageSize: TEST_PREP_PAGE_SIZE, total, totalPages: Math.max(1, Math.ceil(total / TEST_PREP_PAGE_SIZE)), rows };
}
