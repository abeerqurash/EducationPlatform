import type { PrioritizedGoal } from "./goal-priority";

export type WorkloadBucket = { key: string; label: string; minutes: number; goals: number; titles: string[] };
export type WorkloadForecast = { buckets: WorkloadBucket[]; capacity: number; scheduledMinutes: number; overdueMinutes: number; unscheduledMinutes: number; overloadedWeeks: number; totalGoals: number };
const DAY = 86400000;
const validDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00Z`)) && new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;
const safeMinutes = (minutes: number) => Number.isFinite(minutes) ? Math.max(0, Math.min(100000, Math.floor(minutes))) : 0;
const safeTitle = (title: string) => title.replace(/[\r\n\t]+/g, " ").trim().slice(0, 160);

/** Deadline workload, not a claim of hours worked or an automatically allocated study timetable. */
export function forecastGoalWorkload(goals: readonly PrioritizedGoal[], todayUtc: string, weeklyCapacity = 300): WorkloadForecast {
  const capacity = Number.isFinite(weeklyCapacity) ? Math.max(15, Math.min(10080, Math.floor(weeklyCapacity))) : 300;
  const buckets: WorkloadBucket[] = [
    { key: "overdue", label: "Overdue", minutes: 0, goals: 0, titles: [] },
    ...Array.from({ length: 4 }, (_, i) => ({ key: `week-${i + 1}`, label: `Days ${i * 7}–${i * 7 + 6}`, minutes: 0, goals: 0, titles: [] })),
    { key: "later", label: "After 28 days", minutes: 0, goals: 0, titles: [] },
    { key: "unscheduled", label: "No deadline", minutes: 0, goals: 0, titles: [] },
  ];
  if (!validDate(todayUtc)) return { buckets, capacity, scheduledMinutes: 0, overdueMinutes: 0, unscheduledMinutes: 0, overloadedWeeks: 0, totalGoals: 0 };
  const today = Date.parse(`${todayUtc}T00:00:00Z`);
  for (const goal of goals) {
    const date = goal.targetDate && validDate(goal.targetDate) ? Date.parse(`${goal.targetDate}T00:00:00Z`) : null;
    const days = date === null ? null : Math.round((date - today) / DAY);
    const index = days === null ? 6 : days < 0 ? 0 : days < 28 ? Math.floor(days / 7) + 1 : 5;
    const bucket = buckets[index];
    bucket.minutes += safeMinutes(goal.targetMinutes);
    bucket.goals++;
    if (bucket.titles.length < 10) bucket.titles.push(safeTitle(goal.title));
  }
  return { buckets, capacity, scheduledMinutes: buckets.slice(1, 6).reduce((sum, item) => sum + item.minutes, 0), overdueMinutes: buckets[0].minutes, unscheduledMinutes: buckets[6].minutes, overloadedWeeks: buckets.slice(1, 5).filter(item => item.minutes > capacity).length, totalGoals: buckets.reduce((sum, item) => sum + item.goals, 0) };
}

export function workloadForecastText(forecast: WorkloadForecast, todayUtc: string): string {
  return ["STUDY GOAL WORKLOAD FORECAST", `Reference date (UTC): ${todayUtc}`, `Weekly comparison capacity: ${forecast.capacity} minutes`, `Open goals in forecast: ${forecast.totalGoals}`, "", ...forecast.buckets.map(bucket => `${bucket.label}: ${bucket.goals} goals; ${bucket.minutes} planned minutes${bucket.key.startsWith("week-") && bucket.minutes > forecast.capacity ? " (above weekly capacity)" : ""}`), "", "These are goal target minutes grouped by deadline, not completed study time or a scheduled timetable.", ""].join("\n");
}

const csvCell = (value: string | number) => { const text = String(value); const guarded = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text; return `"${guarded.replace(/"/g, '""')}"`; };
export function workloadForecastCsv(forecast: WorkloadForecast): string {
  return ["Bucket,Goals,Planned minutes,Weekly capacity,Above capacity", ...forecast.buckets.map(bucket => [bucket.label, bucket.goals, bucket.minutes, forecast.capacity, bucket.key.startsWith("week-") && bucket.minutes > forecast.capacity ? "Yes" : "No"].map(csvCell).join(","))].join("\r\n") + "\r\n";
}
