import { describe, expect, it } from "vitest";
import { compareStudySchedules, formatStudyScheduleComparisonCsv, formatStudyScheduleComparisonText } from "../../../../apps/web/src/app/dashboard/progress/study-schedule-comparison";
import type { WeeklyStudySchedule } from "../../../../apps/web/src/app/dashboard/progress/study-weekly-schedule";
const make = (days: [WeeklyStudySchedule["entries"][number]["day"], number][]): WeeklyStudySchedule => ({ version: 1, benchmarkMinutes: 30, scheduledMinutes: days.reduce((sum, [, n]) => sum + n, 0), scheduledDays: days.length, entries: days.map(([day, minutes]) => ({ day, minutes, action: "Study" })), note: "Planned only" });
describe("weekly schedule comparisons", () => {
  it("compares matching plans", () => { const x = compareStudySchedules(make([["Monday", 30]]), make([["Monday", 30]])); expect(x.differenceMinutes).toBe(0); expect(x.daysChanged).toEqual([]); });
  it("detects added days", () => { const x = compareStudySchedules(make([["Monday", 30], ["Friday", 45]]), make([["Monday", 30]])); expect(x.daysAdded).toEqual(["Friday"]); expect(x.differenceMinutes).toBe(45); });
  it("detects removed days", () => { const x = compareStudySchedules(make([]), make([["Sunday", 45]])); expect(x.daysRemoved).toEqual(["Sunday"]); expect(x.differenceMinutes).toBe(-45); });
  it("detects day duration changes", () => { const x = compareStudySchedules(make([["Monday", 60]]), make([["Monday", 30]])); expect(x.daysChanged).toEqual([{ day: "Monday", planned: 60, baseline: 30, difference: 30 }]); });
  it("uses entries rather than stale stored totals", () => { const current = make([["Monday", 60]]); current.scheduledMinutes = 1; expect(compareStudySchedules(current, make([])).plannedMinutes).toBe(60); });
  it("reports percentages", () => { expect(compareStudySchedules(make([["Monday", 45]]), make([["Monday", 30]])).differencePercent).toBe(50); });
  it("avoids division by zero", () => { expect(compareStudySchedules(make([["Monday", 30]]), make([])).differencePercent).toBeNull(); });
  it("exports readable text", () => { const t = formatStudyScheduleComparisonText(compareStudySchedules(make([]), make([]), "Baseline")); expect(t).toContain("Baseline"); expect(t).toContain("planned"); });
  it("escapes spreadsheet formulas in reference names", () => { const csv = formatStudyScheduleComparisonCsv(compareStudySchedules(make([]), make([]), '=SUM(1,2)')); expect(csv).toContain("'=SUM(1,2)"); });
  it("exports CSV with expected metrics", () => { const csv = formatStudyScheduleComparisonCsv(compareStudySchedules(make([["Tuesday", 20]]), make([]))); expect(csv).toContain("planned_minutes"); expect(csv).toContain("Tuesday"); });
});
