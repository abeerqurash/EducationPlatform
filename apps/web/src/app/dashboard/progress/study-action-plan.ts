import { summarizeLearningRecommendations, type LearningDay, type LearningRecommendation } from "./learning-recommendations";

export type StudyActionPlan = {
  version: 1;
  period: { startUtc: string | null; endUtc: string | null; days: number };
  benchmarkMinutes: number;
  summary: { totalMinutes: number; activeDays: number; benchmarkDays: number; averageActiveMinutes: number };
  actions: { id: string; title: string; nextStep: string; reason: string; priority: LearningRecommendation["priority"] }[];
  disclaimer: string;
};

const DISCLAIMER = "Informational guidance based on recorded activity only; not a measure of learning outcomes or educator advice.";

export function buildStudyActionPlan(days: readonly LearningDay[], benchmark = 30, selectedIds?: readonly string[]): StudyActionPlan {
  const report = summarizeLearningRecommendations(days, benchmark);
  const safeBenchmark = Number.isFinite(benchmark) && benchmark > 0 ? Math.min(720, Math.floor(benchmark)) : 30;
  const dates = days.map(d => d.day).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(`${d}T00:00:00Z`))).sort();
  const allowed = selectedIds === undefined ? null : new Set(selectedIds);
  return {
    version: 1,
    period: { startUtc: dates[0] ?? null, endUtc: dates.at(-1) ?? null, days: report.observedDays },
    benchmarkMinutes: safeBenchmark,
    summary: { totalMinutes: report.totalMinutes, activeDays: report.activeDays, benchmarkDays: report.benchmarkDays, averageActiveMinutes: report.averageActiveMinutes },
    actions: report.recommendations.filter(item => allowed === null || allowed.has(item.id)).map(item => ({ id: item.id, title: item.title, nextStep: item.action, reason: item.detail, priority: item.priority })),
    disclaimer: DISCLAIMER,
  };
}

export function formatStudyActionPlanText(plan: StudyActionPlan): string {
  const lines = [
    "STUDY ACTION PLAN", "",
    `Period (UTC): ${plan.period.startUtc ?? "No records"} to ${plan.period.endUtc ?? "No records"}`,
    `Days reviewed: ${plan.period.days}`,
    `Daily benchmark: ${plan.benchmarkMinutes} minutes`,
    `Recorded minutes: ${plan.summary.totalMinutes}`,
    `Active days: ${plan.summary.activeDays}`,
    `Benchmark days: ${plan.summary.benchmarkDays}`,
    `Average active-day minutes: ${plan.summary.averageActiveMinutes}`,
    "", "SELECTED NEXT STEPS", "",
  ];
  if (!plan.actions.length) lines.push("No actions selected.");
  for (const [index, item] of plan.actions.entries()) {
    lines.push(`${index + 1}. ${item.title}`, `   Action: ${item.nextStep}`, `   Context: ${item.reason}`, "");
  }
  lines.push(plan.disclaimer);
  return lines.join("\n") + "\n";
}

export function studyActionPlanFilename(plan: StudyActionPlan, extension: "txt" | "json"): string {
  const day = plan.period.endUtc ?? "undated";
  return `study-action-plan-${day}.${extension}`;
}
