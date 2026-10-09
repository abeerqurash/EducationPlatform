import { describe, expect, it } from "vitest";
import { formatSelectedGoals, selectedGoalFilename, selectGoalsForExport } from "../../../../apps/web/src/components/dashboard/study-goal-selected-export";
const goals = [
  { id: "a", title: "=SUM(A1:A2)", description: null, completedAt: null, targetDate: null, targetMinutes: 20 },
  { id: "b", title: "Reading", description: "Review", completedAt: null, targetDate: "2026-10-10", targetMinutes: 40 },
  { id: "c", title: "Writing", description: null, completedAt: null, targetDate: null, targetMinutes: 60 },
];
const filter = { query: "", status: "all", deadline: "all", sort: "title" };
describe("selected study goal exports", () => {
  it("preserves matching order and ignores stale selected IDs", () => expect(selectGoalsForExport(goals, ["c", "missing", "a"]).map(goal => goal.id)).toEqual(["a", "c"]));
  it("does not duplicate records when selected IDs repeat", () => expect(selectGoalsForExport(goals, ["a", "a", "b"]).map(goal => goal.id)).toEqual(["a", "b"]));
  it("enforces an explicit selection limit", () => expect(selectGoalsForExport(goals, ["a", "b", "c"], 2).map(goal => goal.id)).toEqual(["a", "b"]));
  it("supports an empty selection", () => expect(selectGoalsForExport(goals, [])).toEqual([]));
  it("adds selected scope to JSON without changing the input", () => { const before = JSON.stringify(goals); const output = JSON.parse(formatSelectedGoals(goals.slice(0, 1), filter, "json", "2026-10-10")); expect(output.exportScope).toBe("selected"); expect(output.count).toBe(1); expect(JSON.stringify(goals)).toBe(before); });
  it("retains CSV spreadsheet injection protection", () => expect(formatSelectedGoals(goals.slice(0, 1), filter, "csv", "now")).toContain('"\'=SUM(A1:A2)"'));
  it("labels TXT output and safely names downloads", () => { expect(formatSelectedGoals(goals, filter, "txt", "now")).toContain("SELECTED RECORDS"); expect(selectedGoalFilename("csv", "../bad")).toBe("study-goals-selected-export.csv"); });
});
