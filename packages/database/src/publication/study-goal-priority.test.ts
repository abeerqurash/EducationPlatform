import { describe, expect, it } from "vitest";
import { prioritizeStudyGoals, summarizePriorityQueue, formatPriorityQueueText } from "../../../../apps/web/src/app/dashboard/study-plan/goal-priority";
const goal = (id: string, targetDate: string | null, targetMinutes: number | null = 30, completedAt: Date | null = null) => ({ id, title: `Goal ${id}`, targetDate, targetMinutes, completedAt });
describe("study goal priority queue", () => {
  it("sorts overdue, today, soon, later, then undated", () => { const list = prioritizeStudyGoals([goal("none", null), goal("later", "2026-11-01"), goal("soon", "2026-10-14"), goal("today", "2026-10-10"), goal("late", "2026-10-01")], "2026-10-10"); expect(list.map(g => g.id)).toEqual(["late", "today", "soon", "later", "none"]); });
  it("excludes completed goals", () => expect(prioritizeStudyGoals([goal("done", null, 20, new Date())], "2026-10-10")).toEqual([]));
  it("calculates UTC days correctly", () => expect(prioritizeStudyGoals([goal("x", "2026-10-17")], "2026-10-10")[0].daysUntilDue).toBe(7));
  it("does not accept invalid reference dates", () => expect(prioritizeStudyGoals([goal("x", null)], "2026-02-30")).toEqual([]));
  it("treats invalid deadlines as unscheduled", () => expect(prioritizeStudyGoals([goal("x", "2026-02-30")], "2026-10-10")[0].priority).toBe("unscheduled"));
  it("limits output to requested size", () => expect(prioritizeStudyGoals(Array.from({length: 20}, (_, i) => goal(String(i), null)), "2026-10-10", 3)).toHaveLength(3));
  it("clamps negative and nonfinite minutes", () => expect(prioritizeStudyGoals([goal("x", null, -2)], "2026-10-10")[0].targetMinutes).toBe(0));
  it("clamps extreme minutes", () => expect(prioritizeStudyGoals([goal("x", null, 999999)], "2026-10-10")[0].targetMinutes).toBe(100000));
  it("summarizes urgent and unscheduled", () => expect(summarizePriorityQueue(prioritizeStudyGoals([goal("a", "2026-10-09"), goal("b", null)], "2026-10-10"))).toMatchObject({visible: 2, urgent: 1, withoutDeadline: 1, plannedMinutes: 60}));
  it("generates safe single-line reports", () => expect(formatPriorityQueueText([{...prioritizeStudyGoals([goal("x", null)], "2026-10-10")[0], title: "Line 1\nLine 2"}], "2026-10-10")).toContain("Line 1 Line 2"));
  it("renders an empty queue report", () => expect(formatPriorityQueueText([], "2026-10-10")).toContain("No open goals"));
});
