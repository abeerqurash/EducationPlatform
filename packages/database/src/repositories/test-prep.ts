import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../client";
import { studentCalculatorResults } from "../schema";

/** Only persisted, saved SAT/ACT results owned by this account. */
export async function getStudentTestPrepOverview(userId: string) {
  const examFilter = sql`${studentCalculatorResults.toolSlug} ~ '(^|-)(sat|act)(-|$)'`;
  const ownership = and(
    eq(studentCalculatorResults.userId, userId),
    eq(studentCalculatorResults.isSaved, true),
    examFilter,
  );
  const [totals, recent] = await Promise.all([
    db.select({
      savedCount: sql<number>`count(*)::int`,
      satCount: sql<number>`count(*) filter (where ${studentCalculatorResults.toolSlug} ~ '(^|-)sat(-|$)')::int`,
      actCount: sql<number>`count(*) filter (where ${studentCalculatorResults.toolSlug} ~ '(^|-)act(-|$)')::int`,
    }).from(studentCalculatorResults).where(ownership),
    db.select({
      id: studentCalculatorResults.id,
      toolName: studentCalculatorResults.toolName,
      toolSlug: studentCalculatorResults.toolSlug,
      summary: studentCalculatorResults.summary,
      calculatorVersion: studentCalculatorResults.calculatorVersion,
      createdAt: studentCalculatorResults.createdAt,
    }).from(studentCalculatorResults).where(ownership)
      .orderBy(desc(studentCalculatorResults.createdAt), desc(studentCalculatorResults.id))
      .limit(30),
  ]);
  return {
    savedCount: totals[0]?.savedCount ?? 0,
    satCount: totals[0]?.satCount ?? 0,
    actCount: totals[0]?.actCount ?? 0,
    recent,
  };
}
