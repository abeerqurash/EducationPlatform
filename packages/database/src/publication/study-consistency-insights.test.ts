import { describe, expect, it } from "vitest";
import { summarizeStudyDays } from "../../../../apps/web/src/app/dashboard/progress/insights";

describe("study consistency insights", () => {
  it("handles an empty period", () => {
    expect(summarizeStudyDays([])).toEqual({ longestStreak: 0, currentStreak: 0, totalMinutes: 0, totalActivities: 0, activeDays: 0, weeks: [] });
  });
  it("counts streaks and resets them after inactive days", () => {
    const days = [10, 20, 0, 0, 30, 5, 2].map((minutes, i) => ({ day: `2026-10-${String(i + 1).padStart(2, "0")}`, minutes, activities: minutes ? 1 : 0 }));
    const summary = summarizeStudyDays(days);
    expect(summary.longestStreak).toBe(3);
    expect(summary.currentStreak).toBe(3);
    expect(summary.activeDays).toBe(5);
    expect(summary.totalMinutes).toBe(67);
    expect(summary.weeks[0]).toMatchObject({ minutes: 67, activities: 5, activeDays: 5, days: 7 });
  });
  it("splits days into seven-day groups without dropping the remainder", () => {
    const days = Array.from({ length: 16 }, (_, i) => ({ day: `2026-09-${String(i + 1).padStart(2, "0")}`, minutes: 1, activities: 1 }));
    expect(summarizeStudyDays(days).weeks.map(week => week.days)).toEqual([7, 7, 2]);
  });
  it("treats a recorded activity with zero minutes as an active day", () => {
    expect(summarizeStudyDays([{ day: "2026-10-01", minutes: 0, activities: 1 }]).currentStreak).toBe(1);
  });
});
