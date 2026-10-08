import { describe, expect, it } from "vitest";
import { bulkSelectionOnPage, validateBulkGoalIds } from "../../../../apps/web/src/components/dashboard/study-goal-bulk";
const a = "d71b7d0e-75d2-4f2c-9b33-12a21d71b971";
const b = "d71b7d0e-75d2-4f2c-9b33-12a21d71b972";
describe("bulk study goal safety", () => {
  it("accepts valid distinct ids", () => expect(validateBulkGoalIds([a, b])).toEqual([a, b]));
  it("rejects duplicates", () => expect(validateBulkGoalIds([a, a])).toBeNull());
  it("rejects invalid and empty inputs", () => { expect(validateBulkGoalIds([])).toBeNull(); expect(validateBulkGoalIds(["not-uuid"])).toBeNull(); });
  it("rejects oversized batches", () => expect(validateBulkGoalIds(Array.from({ length: 51 }, () => a))).toBeNull());
  it("checks page selection independently", () => { expect(bulkSelectionOnPage([a, b], [a])).toBe(true); expect(bulkSelectionOnPage([a], [a, b])).toBe(false); expect(bulkSelectionOnPage([], [])).toBe(false); });
});

import { describeBulkSelection, reconcileBulkSelection } from "../../../../apps/web/src/components/dashboard/study-goal-bulk";
describe("bulk selection consistency", () => {
  it("removes stale and duplicate ids", () => expect(reconcileBulkSelection([a, a, b], [a])).toEqual([a]));
  it("keeps selection within the maximum batch size", () => expect(reconcileBulkSelection(Array.from({ length: 60 }, (_, i) => String(i)), Array.from({ length: 60 }, (_, i) => String(i)))).toHaveLength(50));
  it("includes operation and preview in confirmation", () => expect(describeBulkSelection(["Study algebra"], "archive")).toContain("Archive 1 selected goal"));
  it("truncates large title previews", () => expect(describeBulkSelection(["x".repeat(200)], "complete")).not.toContain("x".repeat(101)));
});
