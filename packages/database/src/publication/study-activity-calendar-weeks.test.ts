import { describe, expect, it } from "vitest";
import { summarizeActivityWeeks, utcWeekStart } from "../../../../apps/web/src/app/dashboard/progress/calendar-weeks";

const days = [
  { day: "2026-10-04", minutes: 30, activities: 2 },
  { day: "2026-10-05", minutes: 0, activities: 0 },
  { day: "2026-10-06", minutes: 90, activities: 3 },
  { day: "2026-10-07", minutes: 60, activities: 1 },
];
describe("UTC activity weekly summaries", () => {
  it("uses Monday as UTC week start", () => expect(utcWeekStart("2026-10-04")).toBe("2026-09-28"));
  it("rejects invalid calendar dates", () => expect(utcWeekStart("2026-02-30")).toBeNull());
  it("rejects malformed date strings", () => expect(utcWeekStart("invalid")).toBeNull());
  it("groups across week boundaries", () => expect(summarizeActivityWeeks(days).map(w => w.start)).toEqual(["2026-09-28", "2026-10-05"]));
  it("calculates recorded totals", () => expect(summarizeActivityWeeks(days)[1]).toMatchObject({ minutes: 150, activities: 4, activeDays: 2, observedDays: 3, averageMinutes: 50 }));
  it("tracks the busiest day", () => expect(summarizeActivityWeeks(days)[1].busiestDay).toBe("2026-10-06"));
  it("does not compare unequal partial weeks", () => expect(summarizeActivityWeeks(days)[1].comparable).toBe(false));
  it("compares equally observed spans", () => expect(summarizeActivityWeeks([{ day: "2026-10-04", minutes: 10, activities: 1 }, { day: "2026-10-05", minutes: 20, activities: 1 }])[1]).toMatchObject({ changeMinutes: 10, comparable: true }));
  it("normalizes negative and nonfinite inputs", () => expect(summarizeActivityWeeks([{ day: "2026-10-05", minutes: -5, activities: NaN }])[0]).toMatchObject({ minutes: 0, activities: 0 }));
  it("ignores invalid dates", () => expect(summarizeActivityWeeks([{ day: "2026-13-01", minutes: 5, activities: 1 }])).toEqual([]));
  it("handles no records", () => expect(summarizeActivityWeeks([])).toEqual([]));
  it("does not mutate the source", () => { const original = JSON.stringify(days); summarizeActivityWeeks(days); expect(JSON.stringify(days)).toBe(original); });
});
