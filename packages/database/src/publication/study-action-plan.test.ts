import { describe, expect, it } from "vitest";
import { buildStudyActionPlan, formatStudyActionPlanText, studyActionPlanFilename } from "../../../../apps/web/src/app/dashboard/progress/study-action-plan";
const day = (date: string, minutes: number, activities = minutes ? 1 : 0) => ({ day: date, minutes, activities });
describe("study action plan", () => {
  it("generates a first-session action without activity", () => expect(buildStudyActionPlan([]).actions[0].id).toBe("first-session"));
  it("keeps UTC reporting boundaries sorted", () => { const plan = buildStudyActionPlan([day("2026-10-03", 5), day("2026-10-01", 15)]); expect(plan.period).toEqual({ startUtc: "2026-10-01", endUtc: "2026-10-03", days: 2 }); });
  it("omits actions not selected", () => expect(buildStudyActionPlan([], 30, []).actions).toHaveLength(0));
  it("keeps a selected action", () => expect(buildStudyActionPlan([], 30, ["first-session"]).actions).toHaveLength(1));
  it("does not allow arbitrary selected ids to inject actions", () => expect(buildStudyActionPlan([], 30, ["not-real"]).actions).toHaveLength(0));
  it("falls back to 30 for an invalid benchmark", () => expect(buildStudyActionPlan([], Infinity).benchmarkMinutes).toBe(30));
  it("caps the benchmark at 720", () => expect(buildStudyActionPlan([], 1000).benchmarkMinutes).toBe(720));
  it("includes summary without individual activity records", () => { const plan = buildStudyActionPlan([day("2026-10-01", 35)]); expect(plan.summary.totalMinutes).toBe(35); expect(JSON.stringify(plan)).not.toContain("createdAt"); });
  it("formats a readable offline plan", () => { const text = formatStudyActionPlanText(buildStudyActionPlan([])); expect(text).toContain("STUDY ACTION PLAN"); expect(text).toContain("Start with one recorded session"); });
  it("formats an empty action selection", () => expect(formatStudyActionPlanText(buildStudyActionPlan([], 30, []))).toContain("No actions selected."));
  it("produces deterministic date-stamped filenames", () => expect(studyActionPlanFilename(buildStudyActionPlan([day("2026-10-01", 5)]), "json")).toBe("study-action-plan-2026-10-01.json"));
  it("uses a safe filename for empty data", () => expect(studyActionPlanFilename(buildStudyActionPlan([]), "txt")).toBe("study-action-plan-undated.txt"));
});
