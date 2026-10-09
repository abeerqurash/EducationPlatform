import { describe, expect, it } from "vitest";
import { bulkSelectionRemainder, reconcileBulkSelection, selectMatchingGoals, MAX_BULK_GOALS } from "../../../../apps/web/src/components/dashboard/study-goal-bulk";

describe("cross-page goal selection", () => {
  it("selects goals across pages in visible sort order", () => expect(selectMatchingGoals(["a", "b", "c"])).toEqual(["a", "b", "c"]));
  it("never exceeds the server safety limit", () => expect(selectMatchingGoals(Array.from({ length: 100 }, (_, i) => String(i)))).toHaveLength(MAX_BULK_GOALS));
  it("does not select duplicates", () => expect(selectMatchingGoals(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]));
  it("respects an explicit smaller cap", () => expect(selectMatchingGoals(["a", "b", "c"], 2)).toEqual(["a", "b"]));
  it("rejects negative or fractional caps safely", () => { expect(selectMatchingGoals(["a"], -1)).toEqual([]); expect(selectMatchingGoals(["a"], 0.5)).toEqual(["a"]); });
  it("explains how many goals are excluded by the cap", () => { expect(bulkSelectionRemainder(55)).toBe(5); expect(bulkSelectionRemainder(12)).toBe(0); });
  it("drops goals that no longer match after a filter change", () => expect(reconcileBulkSelection(["a", "b", "c"], ["b"])).toEqual(["b"]));
});
