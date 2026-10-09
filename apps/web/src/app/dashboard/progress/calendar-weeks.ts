import type { CalendarActivityDay } from "./activity-calendar";

/** UTC ISO weeks, Monday to Sunday. All figures derive only from supplied daily totals. */
export function utcWeekStart(day: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const date = new Date(`${day}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== day) return null;
  const mondayOffset = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - mondayOffset);
  return date.toISOString().slice(0, 10);
}

export function summarizeActivityWeeks(days: readonly CalendarActivityDay[]) {
  const groups = new Map<string, { day: string; minutes: number; activities: number }[]>();
  for (const day of days) {
    const start = utcWeekStart(day.day);
    if (!start) continue;
    const minutes = Number.isFinite(day.minutes) ? Math.max(0, day.minutes) : 0;
    const activities = Number.isFinite(day.activities) ? Math.max(0, day.activities) : 0;
    groups.set(start, [...(groups.get(start) ?? []), { day: day.day, minutes, activities }]);
  }
  const weeks = [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([start, entries]) => {
    const minutes = entries.reduce((sum, d) => sum + d.minutes, 0);
    const activities = entries.reduce((sum, d) => sum + d.activities, 0);
    const activeDays = entries.filter(d => d.minutes > 0 || d.activities > 0).length;
    const busiest = entries.reduce<(typeof entries)[number] | null>((best, d) => !best || d.minutes > best.minutes ? d : best, null);
    return { start, minutes, activities, activeDays, observedDays: entries.length, averageMinutes: entries.length ? Math.round(minutes / entries.length) : 0, busiestDay: busiest?.day ?? null };
  });
  return weeks.map((week, index) => ({
    ...week,
    changeMinutes: index === 0 ? null : week.minutes - weeks[index - 1].minutes,
    // Comparing partial weeks is misleading; surface the delta only for equally observed spans.
    comparable: index > 0 && week.observedDays === weeks[index - 1].observedDays,
  }));
}
