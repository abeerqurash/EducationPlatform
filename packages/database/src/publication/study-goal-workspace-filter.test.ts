import { describe, expect, it } from "vitest";
import { filterAndSortGoals } from "../../../../apps/web/src/components/dashboard/study-goal-filter";
const goals = [
  { id: "a", title: "Math exam", description: "algebra", targetDate: "2026-10-08", targetMinutes: 60, completedAt: null },
  { id: "b", title: "Read biology", description: null, targetDate: "2026-10-12", targetMinutes: 20, completedAt: null },
  { id: "c", title: "Review physics", description: "notes", targetDate: null, targetMinutes: 10, completedAt: null },
  { id: "d", title: "Math revision", description: null, targetDate: "2026-10-09", targetMinutes: 40, completedAt: "2026-10-09" },
];
const base = { query: "", status: "all", deadline: "all", sort: "deadline" };
describe("study goal workspace filters", () => {
  it("searches title and notes without mutating source", () => { const before = goals.map(g => g.id); expect(filterAndSortGoals(goals, { ...base, query: "math" }, "2026-10-09").map(g => g.id)).toEqual(["a", "d"]); expect(goals.map(g => g.id)).toEqual(before); });
  it("filters completed goals", () => expect(filterAndSortGoals(goals, { ...base, status: "completed" }, "2026-10-09").map(g => g.id)).toEqual(["d"]));
  it("filters overdue and upcoming open goals", () => { expect(filterAndSortGoals(goals, { ...base, deadline: "overdue" }, "2026-10-09").map(g => g.id)).toEqual(["a"]); expect(filterAndSortGoals(goals, { ...base, deadline: "upcoming" }, "2026-10-09").map(g => g.id)).toEqual(["b"]); });
  it("sorts by minutes descending", () => expect(filterAndSortGoals(goals, { ...base, sort: "minutes" }, "2026-10-09").map(g => g.id)).toEqual(["a", "d", "b", "c"]));
  it("handles empty inputs", () => expect(filterAndSortGoals([], base, "2026-10-09")).toEqual([]));
});
