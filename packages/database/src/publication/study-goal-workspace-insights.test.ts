import { describe, expect, it } from "vitest";
import { summarizeWorkspaceGoals } from "../../../../apps/web/src/components/dashboard/study-goal-workspace-insights";

const goal = (id: string, targetDate: string | null, completedAt: string | null = null, targetMinutes: number | null = 60) => ({ id, title: id, description: null, targetDate, completedAt, targetMinutes });

describe("filtered study goal insights", () => {
  it("handles empty sets without division by zero", () => {
    expect(summarizeWorkspaceGoals([], "2026-10-09")).toMatchObject({ total: 0, completionRate: 0, plannedMinutes: 0, nextDeadline: null });
  });
  it("separates overdue, today, upcoming, unscheduled and completed", () => {
    const result = summarizeWorkspaceGoals([goal("late", "2026-10-08"), goal("today", "2026-10-09"), goal("soon", "2026-10-16"), goal("far", "2026-10-17"), goal("none", null), goal("done", "2026-10-01", "2026-10-08")], "2026-10-09");
    expect(result).toMatchObject({ total: 6, open: 5, completed: 1, overdue: 1, dueToday: 1, dueNextSevenDays: 1, unscheduled: 1, completionRate: 17, nextDeadline: "2026-10-09" });
  });
  it("totals completed and remaining target minutes", () => {
    expect(summarizeWorkspaceGoals([goal("a", null, null, 90), goal("b", null, "2026-10-08", 30), goal("c", null, null, null)], "2026-10-09")).toMatchObject({ plannedMinutes: 120, completedMinutes: 30, remainingMinutes: 90 });
  });
  it("does not count completed deadlines as overdue", () => {
    expect(summarizeWorkspaceGoals([goal("done", "2026-01-01", "2026-10-08")], "2026-10-09")).toMatchObject({ overdue: 0, completed: 1, nextDeadline: null });
  });
  it("rejects invalid current dates", () => {
    expect(() => summarizeWorkspaceGoals([], "invalid")).toThrow();
  });
  it("handles year boundaries using UTC dates", () => {
    expect(summarizeWorkspaceGoals([goal("new-year", "2027-01-02")], "2026-12-29")).toMatchObject({ dueNextSevenDays: 1, nextDeadline: "2027-01-02" });
  });
});
