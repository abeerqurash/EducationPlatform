/** Deterministic, informational suggestions from account-scoped UTC study totals. */
export type LearningDay = { day: string; minutes: number; activities: number };
export type LearningRecommendation = { id: string; title: string; detail: string; action: string; priority: "high" | "medium" | "positive" };
const safe = (n: number) => Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;

export function summarizeLearningRecommendations(days: readonly LearningDay[], targetMinutes = 30) {
  const target = Number.isFinite(targetMinutes) && targetMinutes > 0 ? Math.min(720, Math.floor(targetMinutes)) : 30;
  const ordered = [...days].filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d.day) && !Number.isNaN(Date.parse(`${d.day}T00:00:00Z`))).sort((a, b) => a.day.localeCompare(b.day));
  const normalized = ordered.map(d => ({ day: d.day, minutes: safe(d.minutes), activities: safe(d.activities) }));
  const active = normalized.filter(d => d.minutes > 0 || d.activities > 0);
  const met = normalized.filter(d => d.minutes >= target);
  const totalMinutes = normalized.reduce((sum, d) => sum + d.minutes, 0);
  const recent = normalized.slice(-7);
  const prior = normalized.slice(-14, -7);
  const recentMinutes = recent.reduce((sum, d) => sum + d.minutes, 0);
  const priorMinutes = prior.reduce((sum, d) => sum + d.minutes, 0);
  const averageActiveMinutes = active.length ? Math.round(totalMinutes / active.length) : 0;
  const recommendations: LearningRecommendation[] = [];
  if (!active.length) {
    recommendations.push({ id: "first-session", title: "Start with one recorded session", detail: "No activity has been recorded in this reporting period. Your progress updates only after you save real study activity.", action: "Record a completed study session below", priority: "high" });
  } else {
    if (active.length < Math.ceil(normalized.length / 2)) recommendations.push({ id: "consistency", title: "Build a steadier study routine", detail: `${active.length} of ${normalized.length} days have recorded activity. Try a manageable session on an additional day each week.`, action: "Choose a regular study time", priority: "medium" });
    if (met.length < active.length && averageActiveMinutes < target) recommendations.push({ id: "duration", title: "Work toward your daily benchmark", detail: `Your average active day contains ${averageActiveMinutes} recorded minutes, compared with the ${target}-minute benchmark.`, action: "Increase session length gradually", priority: "medium" });
    if (prior.length === 7 && recent.length === 7 && recentMinutes < priorMinutes) recommendations.push({ id: "trend", title: "Review the recent slowdown", detail: `The latest seven days contain ${recentMinutes} minutes, compared with ${priorMinutes} in the preceding seven days.`, action: "Review your schedule and study goals", priority: "medium" });
    if (met.length >= Math.ceil(normalized.length * .7) && normalized.length >= 7) recommendations.push({ id: "momentum", title: "Keep your momentum", detail: `You reached the ${target}-minute benchmark on ${met.length} of ${normalized.length} days.`, action: "Maintain your current routine", priority: "positive" });
    if (!recommendations.length) recommendations.push({ id: "steady", title: "Keep recording your progress", detail: `${active.length} active days and ${totalMinutes} recorded minutes in this period.`, action: "Continue logging completed sessions", priority: "positive" });
  }
  return { observedDays: normalized.length, activeDays: active.length, benchmarkDays: met.length, totalMinutes, averageActiveMinutes, recentMinutes, priorMinutes, recommendations: recommendations.slice(0, 3) };
}
