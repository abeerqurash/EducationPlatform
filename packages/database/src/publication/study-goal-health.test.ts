import { describe, expect, it } from "vitest";
import { summarizeGoalHealth } from "../../../../apps/web/src/app/dashboard/study-plan/goal-insights";

const goal = (id: string, targetDate: string | null, completedAt: Date | null = null, targetMinutes: number | null = 30) => ({ id, title: `Goal ${id}`, targetDate, completedAt, targetMinutes });

describe("study goal health analytics", () => {
  it("returns zero-safe statistics for an empty list", () => {
    const summary = summarizeGoalHealth([], "2026-10-09");
    expect(summary).toMatchObject({ total: 0, completionRate: 0, overdue: 0, plannedMinutes: 0, deadlines: [] });
  });
  it("counts overdue, due today, upcoming, and unscheduled open goals", () => {
    const summary = summarizeGoalHealth([goal("a", "2026-10-08"), goal("b", "2026-10-09"), goal("c", "2026-10-16"), goal("d", null), goal("e", "2026-10-20")], "2026-10-09");
    expect(summary).toMatchObject({ overdue: 1, dueToday: 1, upcoming: 1, unscheduled: 1, plannedMinutes: 150 });
    expect(summary.deadlines.map((x) => x.id)).toEqual(["a", "b", "c", "e"]);
  });
  it("excludes completed goals from open deadlines and planned minutes", () => {
    const summary = summarizeGoalHealth([goal("a", "2026-10-01", new Date("2026-10-02T00:00:00Z")), goal("b", null, null, 40)], "2026-10-09");
    expect(summary).toMatchObject({ completed: 1, open: 1, completionRate: 50, overdue: 0, plannedMinutes: 40 });
  });
  it("caps the deadline preview to eight goals", () => {
    const summary = summarizeGoalHealth(Array.from({ length: 12 }, (_, i) => goal(String(i), "2026-10-12")), "2026-10-09");
    expect(summary.deadlines).toHaveLength(8);
  });
});
