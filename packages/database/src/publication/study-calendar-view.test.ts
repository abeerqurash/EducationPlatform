import { describe, expect, it } from "vitest";
import { createActivityCalendar } from "../../../../apps/web/src/app/dashboard/progress/activity-calendar";
import { DAILY_TARGET_OPTIONS, summarizeDailyTarget, visibleCalendarDays } from "../../../../apps/web/src/app/dashboard/progress/calendar-view";
import { summarizeCalendarMilestones } from "../../../../apps/web/src/app/dashboard/progress/calendar-milestones";

const cells = createActivityCalendar([
  { day: "2026-10-01", minutes: 0, activities: 0 },
  { day: "2026-10-02", minutes: 0, activities: 1 },
  { day: "2026-10-03", minutes: 15, activities: 1 },
  { day: "2026-10-04", minutes: 45, activities: 2 },
  { day: "2026-10-05", minutes: 90, activities: 3 },
]).cells;

describe("study calendar configurable benchmark and display", () => {
  it("offers ordered benchmark presets", () => expect(DAILY_TARGET_OPTIONS).toEqual([15, 30, 45, 60, 90]));
  it("preserves all days for the default view", () => expect(visibleCalendarDays(cells, "all", 30)).toHaveLength(5));
  it("counts activity-only dates as active", () => expect(visibleCalendarDays(cells, "active", 30)).toHaveLength(4));
  it("filters target achievements inclusively", () => expect(visibleCalendarDays(cells, "target", 45).map(day => day.day)).toEqual(["2026-10-04", "2026-10-05"]));
  it("filters below-target days including empty days", () => expect(visibleCalendarDays(cells, "missed", 45)).toHaveLength(3));
  it("changes filter results when the target changes", () => expect(visibleCalendarDays(cells, "target", 15)).toHaveLength(3));
  it("uses a safe default for invalid target filters", () => expect(visibleCalendarDays(cells, "target", Number.NaN)).toHaveLength(2));
  it("does not mutate source days", () => { const copy = [...cells]; visibleCalendarDays(cells, "missed", 60); expect(cells).toEqual(copy); });
  it("summarizes a date below the target", () => expect(summarizeDailyTarget(12, 30)).toMatchObject({ remaining: 18, exceeded: 0, percent: 40, achieved: false }));
  it("summarizes a date exactly at target", () => expect(summarizeDailyTarget(45, 45)).toMatchObject({ remaining: 0, exceeded: 0, percent: 100, achieved: true }));
  it("caps the progress indicator without hiding extra minutes", () => expect(summarizeDailyTarget(90, 30)).toMatchObject({ percent: 100, exceeded: 60, achieved: true }));
  it("handles nonfinite minutes and invalid targets", () => expect(summarizeDailyTarget(Number.NaN, -1)).toMatchObject({ target: 30, recorded: 0, remaining: 30, percent: 0 }));
  it("updates milestone achievement counts for each target", () => { expect(summarizeCalendarMilestones(cells, 15).targetDays).toBe(3); expect(summarizeCalendarMilestones(cells, 60).targetDays).toBe(1); });
  it("does not change full-period streak calculations when dates are filtered", () => expect(summarizeCalendarMilestones(cells).longestStreak).toBe(4));
});
