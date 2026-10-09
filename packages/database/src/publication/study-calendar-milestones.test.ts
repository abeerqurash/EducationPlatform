import { describe, expect, it } from "vitest";
import { summarizeCalendarMilestones } from "../../../../apps/web/src/app/dashboard/progress/calendar-milestones";

const day = (date: string, minutes: number, activities = minutes ? 1 : 0) => ({ day: date, minutes, activities });

describe("study calendar milestones", () => {
  it("returns safe empty summaries", () => {
    expect(summarizeCalendarMilestones([])).toMatchObject({ observedDays: 0, targetRate: 0, targetProgress: 0, longestStreak: 0, longestTargetRun: 0 });
  });
  it("counts activity-only dates in active streaks", () => {
    expect(summarizeCalendarMilestones([day("2026-10-01", 0, 1), day("2026-10-02", 10)]).longestStreak).toBe(2);
  });
  it("resets streaks across gaps", () => {
    expect(summarizeCalendarMilestones([day("2026-10-01", 30), day("2026-10-03", 30)]).longestStreak).toBe(1);
  });
  it("resets streaks on inactive dates", () => {
    expect(summarizeCalendarMilestones([day("2026-10-01", 10), day("2026-10-02", 0), day("2026-10-03", 10)]).longestStreak).toBe(1);
  });
  it("caps minutes at the daily benchmark", () => {
    expect(summarizeCalendarMilestones([day("2026-10-01", 120), day("2026-10-02", 0)])).toMatchObject({ achievedMinutes: 30, targetMinutes: 60, targetProgress: 50 });
  });
  it("calculates target-day coverage", () => {
    expect(summarizeCalendarMilestones([day("2026-10-01", 30), day("2026-10-02", 10), day("2026-10-03", 60)])).toMatchObject({ targetDays: 2, targetRate: 67 });
  });
  it("tracks consecutive target days", () => {
    expect(summarizeCalendarMilestones([day("2026-10-01", 30), day("2026-10-02", 40), day("2026-10-03", 5)]).longestTargetRun).toBe(2);
  });
  it("sorts out-of-order dates", () => {
    expect(summarizeCalendarMilestones([day("2026-10-02", 10), day("2026-10-01", 10)]).longestStreak).toBe(2);
  });
  it("normalizes nonfinite and negative minutes", () => {
    expect(summarizeCalendarMilestones([day("2026-10-01", Number.NaN), day("2026-10-02", -10)]).achievedMinutes).toBe(0);
  });
  it("supports an explicit positive daily target", () => {
    expect(summarizeCalendarMilestones([day("2026-10-01", 15)], 15)).toMatchObject({ target: 15, targetDays: 1, targetProgress: 100 });
  });
});
