import { describe, expect, it } from "vitest";
import { groupGoalsByDeadline } from "../../../../apps/web/src/components/dashboard/study-goal-deadline-groups";

const goal = (id: string, targetDate: string | null, completedAt: string | null = null, targetMinutes: number | null = 30) => ({ id, title: id, description: null, targetDate, completedAt, targetMinutes });

describe("study goal deadline groups", () => {
  it("returns no sections for an empty page", () => expect(groupGoalsByDeadline([], "2026-10-09")).toEqual([]));
  it("groups urgency in stable priority order", () => {
    const result = groupGoalsByDeadline([goal("done", "2026-01-01", "2026-10-08"), goal("far", "2026-10-17"), goal("none", null), goal("today", "2026-10-09"), goal("late", "2026-10-08"), goal("soon", "2026-10-16")], "2026-10-09");
    expect(result.map(group => group.key)).toEqual(["overdue", "today", "soon", "later", "unscheduled", "completed"]);
  });
  it("preserves the original order inside each group", () => {
    expect(groupGoalsByDeadline([goal("b", null), goal("a", null)], "2026-10-09")[0].goals.map(g => g.id)).toEqual(["b", "a"]);
  });
  it("calculates target minutes only for valid positive values", () => {
    expect(groupGoalsByDeadline([goal("a", null, null, 25), goal("b", null, null, -10), goal("c", null, null, null)], "2026-10-09")[0].minutes).toBe(25);
  });
  it("handles the year boundary", () => {
    expect(groupGoalsByDeadline([goal("new", "2027-01-02")], "2026-12-29")[0].key).toBe("soon");
  });
  it("does not classify completed goals as overdue", () => {
    expect(groupGoalsByDeadline([goal("done", "2020-01-01", "2026-10-09")], "2026-10-09")[0].key).toBe("completed");
  });
  it("rejects invalid dates", () => expect(() => groupGoalsByDeadline([], "bad")).toThrow());
});
