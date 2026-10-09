import { describe, expect, it } from "vitest";
import { remainingGroupGoals, toggleBulkGoalGroup } from "../../../../apps/web/src/components/dashboard/study-goal-bulk";

describe("deadline group bulk selection", () => {
  it("adds only group IDs and preserves earlier selections", () => {
    expect(toggleBulkGoalGroup(["outside"], ["a", "b"], true)).toEqual(["outside", "a", "b"]);
  });
  it("removes only selected group IDs when unchecked", () => {
    expect(toggleBulkGoalGroup(["outside", "a", "b"], ["a", "b"], false)).toEqual(["outside"]);
  });
  it("enforces the 50-goal server limit", () => {
    expect(toggleBulkGoalGroup([], Array.from({ length: 80 }, (_, i) => `g${i}`), true)).toHaveLength(50);
  });
  it("never duplicates selected IDs", () => {
    expect(toggleBulkGoalGroup(["a", "a"], ["a", "b", "b"], true)).toEqual(["a", "b"]);
  });
  it("handles a full selection without discarding earlier IDs", () => {
    expect(toggleBulkGoalGroup(["a", "b"], ["c"], true, 2)).toEqual(["a", "b"]);
  });
  it("reports unselected goals without double counting duplicates", () => {
    expect(remainingGroupGoals(["a"], ["a", "b", "b", "c"])).toBe(2);
  });
  it("handles empty groups", () => {
    expect(toggleBulkGoalGroup(["a"], [], true)).toEqual(["a"]);
    expect(remainingGroupGoals([], [])).toBe(0);
  });
});
