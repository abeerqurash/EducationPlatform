import type { StudyActivityRow } from "./study-activity-filter";

/** Aggregates only the bounded, account-scoped rows supplied to the client. */
export function summarizeStudyActivities(rows: readonly StudyActivityRow[]) {
  let totalMinutes = 0;
  let sessions = 0;
  let calculators = 0;
  let longest: StudyActivityRow | null = null;
  const days = new Map<string, { count: number; minutes: number }>();
  for (const row of rows) {
    const minutes = Number.isFinite(row.durationMinutes) ? Math.max(0, row.durationMinutes) : 0;
    totalMinutes += minutes;
    if (row.activityType === "study_session") sessions++;
    else calculators++;
    if (!longest || minutes > Math.max(0, longest.durationMinutes)) longest = row;
    const date = row.createdAt.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const day = days.get(date) ?? { count: 0, minutes: 0 };
    day.count++;
    day.minutes += minutes;
    days.set(date, day);
  }
  const busiest = [...days.entries()].sort((a, b) => b[1].minutes - a[1].minutes || b[1].count - a[1].count || a[0].localeCompare(b[0]))[0];
  return {
    count: rows.length,
    totalMinutes,
    sessions,
    calculators,
    averageMinutes: rows.length ? Math.round(totalMinutes / rows.length) : 0,
    activeDays: days.size,
    busiestDay: busiest?.[0] ?? null,
    busiestDayMinutes: busiest?.[1].minutes ?? 0,
    longestTitle: longest?.title ?? null,
    longestMinutes: longest ? Math.max(0, longest.durationMinutes) : 0,
  };
}
