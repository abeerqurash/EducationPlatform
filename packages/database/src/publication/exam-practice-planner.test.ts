import { describe, expect, it } from "vitest";
import { buildPracticePlan, formatPracticePlanCsv, formatPracticePlanText, PRACTICE_TOPICS } from "../../../../apps/web/src/app/dashboard/test-prep/practice-plan";
describe("SAT and ACT practice planner", () => {
  it("includes only matching exam and shared topics", () => { const p = buildPracticePlan("SAT", PRACTICE_TOPICS.map(t => t.id)); expect(p.selectedTopics.every(t => t.exam === "SAT" || t.exam === "Both")).toBe(true); });
  it("excludes SAT topics from ACT", () => { const p = buildPracticePlan("ACT", PRACTICE_TOPICS.map(t => t.id)); expect(p.selectedTopics.some(t => t.exam === "SAT")).toBe(false); });
  it("never exceeds daily capacity", () => { const p = buildPracticePlan("SAT", PRACTICE_TOPICS.map(t => t.id), 3, 30); expect(p.sessions.every(s => s.totalMinutes <= 30)).toBe(true); });
  it("accounts for all requested minutes", () => { const p = buildPracticePlan("ACT", PRACTICE_TOPICS.map(t => t.id), 3, 30); expect(p.totalMinutes + p.unscheduledMinutes).toBe(p.selectedTopics.reduce((n, t) => n + t.minutes, 0)); });
  it("splits longer topics between days", () => { const p = buildPracticePlan("SAT", ["sat-algebra"], 2, 30); expect(p.sessions.map(s => s.totalMinutes)).toEqual([30, 10]); });
  it("deduplicates selected IDs", () => { const p = buildPracticePlan("SAT", ["sat-algebra", "sat-algebra"]); expect(p.selectedTopics).toHaveLength(1); });
  it("clamps horizon and capacity", () => { const p = buildPracticePlan("SAT", [], 999, 999); expect(p.days).toBe(30); expect(p.dailyCapacity).toBe(240); });
  it("uses defaults for nonfinite values", () => { const p = buildPracticePlan("SAT", [], NaN, Infinity); expect(p.days).toBe(7); expect(p.dailyCapacity).toBe(60); });
  it("supports an empty selection", () => { const p = buildPracticePlan("ACT", []); expect(p.totalMinutes).toBe(0); expect(p.unscheduledMinutes).toBe(0); });
  it("produces readable export", () => { expect(formatPracticePlanText(buildPracticePlan("SAT", ["sat-algebra"]))).toContain("Algebra and linear equations"); });
  it("produces CSV rows", () => { expect(formatPracticePlanCsv(buildPracticePlan("ACT", ["act-math"]))).toContain('"ACT"'); });
  it("keeps CSV heading even when empty", () => { expect(formatPracticePlanCsv(buildPracticePlan("SAT", []))).toBe("day,exam,topic,minutes"); });
});
