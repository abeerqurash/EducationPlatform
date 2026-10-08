import { describe, expect, it } from "vitest";
import { paginateGoals } from "../../../../apps/web/src/components/dashboard/study-goal-pagination";
const goals = Array.from({ length: 43 }, (_, index) => ({ id: index + 1 }));
describe("study goal pagination", () => {
  it("uses ten items by default", () => { const result = paginateGoals(goals, 1, 10); expect(result.items).toHaveLength(10); expect(result.totalPages).toBe(5); expect(result.start).toBe(1); });
  it("returns the final partial page", () => { const result = paginateGoals(goals, 3, 20); expect(result.items).toHaveLength(3); expect(result.end).toBe(43); });
  it("clamps out-of-range pages", () => { expect(paginateGoals(goals, 999, 10).page).toBe(5); expect(paginateGoals(goals, -5, 10).page).toBe(1); });
  it("rejects unsupported sizes", () => expect(paginateGoals(goals, 1, 999).pageSize).toBe(10));
  it("handles empty datasets", () => { const result = paginateGoals([], 4, 10); expect(result.items).toEqual([]); expect(result.start).toBe(0); expect(result.end).toBe(0); });
  it("does not mutate source order", () => { const before = goals.map(goal => goal.id); paginateGoals(goals, 2, 10); expect(goals.map(goal => goal.id)).toEqual(before); });
});
