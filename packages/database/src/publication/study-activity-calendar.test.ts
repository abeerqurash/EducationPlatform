import { describe, expect, it } from "vitest";
import { createActivityCalendar, activityIntensity } from "../../../../apps/web/src/app/dashboard/progress/activity-calendar";

describe("study activity calendar", () => {
  it("treats zero days as inactive", () => expect(activityIntensity(0, 0)).toBe(0));
  it("counts activity without duration", () => expect(activityIntensity(0, 1)).toBe(1));
  it("has deterministic minute thresholds", () => {
    expect([1, 25, 60, 120].map(minutes => activityIntensity(minutes, 1))).toEqual([1, 2, 3, 4]);
  });
  it("handles empty windows", () => expect(createActivityCalendar([])).toMatchObject({ activeDays: 0, coverage: 0, busiest: null }));
  it("calculates coverage and totals", () => {
    const result = createActivityCalendar([{ day: "2026-10-01", minutes: 0, activities: 0 }, { day: "2026-10-02", minutes: 30, activities: 2 }]);
    expect(result).toMatchObject({ activeDays: 1, coverage: 50, totalMinutes: 30, totalActivities: 2 });
    expect(result.busiest?.day).toBe("2026-10-02");
  });
  it("does not mutate the supplied records", () => {
    const days = Object.freeze([Object.freeze({ day: "2026-10-02", minutes: 12, activities: 1 })]);
    expect(createActivityCalendar(days).cells[0].intensity).toBe(1);
  });
  it("normalizes negative and invalid aggregate inputs", () => {
    const result = createActivityCalendar([{ day: "2026-10-02", minutes: -2, activities: Number.NaN }]);
    expect(result).toMatchObject({ totalMinutes: 0, totalActivities: 0 });
  });
});
