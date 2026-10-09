import { describe, expect, it } from "vitest";
import { summarizeLearningRecommendations } from "../../../../apps/web/src/app/dashboard/progress/learning-recommendations";
const d = (day: string, minutes: number, activities = minutes ? 1 : 0) => ({ day, minutes, activities });
describe("learning recommendations", () => {
  it("offers a first-session action for no activity", () => expect(summarizeLearningRecommendations([]).recommendations[0].id).toBe("first-session"));
  it("handles zero-filled reporting periods", () => expect(summarizeLearningRecommendations([d("2026-10-01", 0)]).recommendations[0].id).toBe("first-session"));
  it("counts activity-only days", () => expect(summarizeLearningRecommendations([d("2026-10-01", 0, 1)]).activeDays).toBe(1));
  it("caps negative and nonfinite minutes", () => expect(summarizeLearningRecommendations([d("2026-10-01", -5), d("2026-10-02", Infinity)]).totalMinutes).toBe(0));
  it("computes average over active days", () => expect(summarizeLearningRecommendations([d("2026-10-01", 20), d("2026-10-02", 0), d("2026-10-03", 40)]).averageActiveMinutes).toBe(30));
  it("honors a custom benchmark", () => expect(summarizeLearningRecommendations([d("2026-10-01", 15)], 15).benchmarkDays).toBe(1));
  it("uses default for invalid benchmark", () => expect(summarizeLearningRecommendations([d("2026-10-01", 15)], NaN).benchmarkDays).toBe(0));
  it("detects a genuine seven-day decline", () => { const days = Array.from({length:14},(_,i)=>d(`2026-10-${String(i+1).padStart(2,"0")}`,i<7?60:10)); expect(summarizeLearningRecommendations(days).recommendations.some(x=>x.id==="trend")).toBe(true); });
  it("does not compare incomplete weeks", () => expect(summarizeLearningRecommendations([d("2026-10-01", 60),d("2026-10-02", 10)]).recommendations.some(x=>x.id==="trend")).toBe(false));
  it("recommends momentum after sustained success", () => expect(summarizeLearningRecommendations(Array.from({length:7},(_,i)=>d(`2026-10-0${i+1}`,35))).recommendations[0].id).toBe("momentum"));
  it("sorts out-of-order dates before comparing", () => expect(summarizeLearningRecommendations([d("2026-10-02",20),d("2026-10-01",40)]).totalMinutes).toBe(60));
  it("never returns more than three recommendations", () => expect(summarizeLearningRecommendations(Array.from({length:14},(_,i)=>d(`2026-10-${String(i+1).padStart(2,"0")}`,i<7?10:0))).recommendations.length).toBeLessThanOrEqual(3));
});
