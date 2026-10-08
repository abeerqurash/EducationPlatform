import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const repo = readFileSync(new URL("../repositories/student-intelligence.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/progress/page.tsx", import.meta.url), "utf8");
describe("30-day study trend", () => {
  it("uses bounded UTC dates and groups by the same expression as the selected date", () => {
    const monthly = repo.split("export async function getStudyMonthlyTrend")[1];
    expect(monthly).toContain("setUTCDate(since.getUTCDate() + offset)");
    expect(monthly).toContain("lt(studyActivities.createdAt, until)");
    expect(monthly).toContain(".groupBy(sql`date(${studyActivities.createdAt} at time zone 'UTC')`)");
    expect(monthly).toContain("Array.from({ length: 30 }");
  });
  it("reports exact database aggregates instead of a truncated activity preview", () => {
    const monthly = repo.split("export async function getStudyMonthlyTrend")[1];
    expect(monthly).toContain("count(distinct date(");
    expect(monthly).toContain("coalesce(sum(");
    expect(monthly).not.toContain(".limit(100)");
  });
  it("renders 30 accessible daily bars with actual recorded minutes", () => {
    expect(page).toContain("getStudyMonthlyTrend(userId)");
    expect(page).toContain("monthly.daily.map");
    expect(page).toContain('role="img"');
    expect(page).toContain("monthly.activeDays");
  });
});
