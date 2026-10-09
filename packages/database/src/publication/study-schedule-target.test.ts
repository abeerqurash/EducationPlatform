import { describe, expect, it } from "vitest";
import { reviewWeeklyStudyTarget, formatWeeklyTargetReviewCsv, formatWeeklyTargetReviewText } from "../../../../apps/web/src/app/dashboard/progress/study-schedule-target";
import type { WeeklyStudySchedule } from "../../../../apps/web/src/app/dashboard/progress/study-weekly-schedule";
const schedule = (minutes: number[]): WeeklyStudySchedule => ({ version: 1, benchmarkMinutes: 30, scheduledMinutes: minutes.reduce((a,b)=>a+b,0), scheduledDays: minutes.length, entries: minutes.map((value,index) => ({ day: (["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] as const)[index], minutes: value, action: "Review" })), note: "planned" });
describe("weekly target planning", () => {
  it("reports exact target", () => { const result = reviewWeeklyStudyTarget(schedule([60,60,60]),180); expect(result.status).toBe("met"); expect(result.coveragePercent).toBe(100); });
  it("reports shortfall", () => { const result = reviewWeeklyStudyTarget(schedule([30,30]),180); expect(result.missingMinutes).toBe(120); expect(result.additionalMinutesPerDay).toBe(60); });
  it("rounds recommended daily increase upward", () => expect(reviewWeeklyStudyTarget(schedule([30,30,30]),100).additionalMinutesPerDay).toBe(4));
  it("reports above target", () => { const result = reviewWeeklyStudyTarget(schedule([90,90]),120); expect(result.status).toBe("above"); expect(result.differenceMinutes).toBe(60); });
  it("reports empty schedule", () => expect(reviewWeeklyStudyTarget(schedule([]),300).status).toBe("empty"));
  it("handles no target", () => expect(reviewWeeklyStudyTarget(schedule([30]),0).status).toBe("no-target"));
  it("rejects invalid target", () => expect(reviewWeeklyStudyTarget(schedule([30]),Number.NaN).targetMinutes).toBe(0));
  it("clamps target", () => expect(reviewWeeklyStudyTarget(schedule([30]),999999).targetMinutes).toBe(10080));
  it("uses final entry durations not stale schedule totals", () => { const item = schedule([60,30,45]); item.scheduledMinutes=90; expect(reviewWeeklyStudyTarget(item,300).plannedMinutes).toBe(135); });
  it("provides all seven weekdays", () => expect(reviewWeeklyStudyTarget(schedule([60]),100).daily).toHaveLength(7));
  it("exports text with advisory", () => expect(formatWeeklyTargetReviewText(reviewWeeklyStudyTarget(schedule([30]),100))).toContain("not recorded study activity"));
  it("exports seven CSV day rows", () => expect(formatWeeklyTargetReviewCsv(reviewWeeklyStudyTarget(schedule([30]),100)).trim().split("\r\n")).toHaveLength(8));
});
