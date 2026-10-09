import type { CalendarActivityDay } from "./activity-calendar";

export function groupActivityMonths(days: readonly CalendarActivityDay[]) {
  const groups = new Map<string, CalendarActivityDay[]>();
  for (const day of days) {
    if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(day.day)) continue;
    const key = day.day.slice(0, 7);
    groups.set(key, [...(groups.get(key) ?? []), {
      day: day.day,
      minutes: Number.isFinite(day.minutes) ? Math.max(0, day.minutes) : 0,
      activities: Number.isFinite(day.activities) ? Math.max(0, day.activities) : 0,
    }]);
  }
  return [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([key, values]) => {
    const entries = [...values].sort((a, b) => a.day.localeCompare(b.day));
    const activeDays = entries.filter(d => d.minutes > 0 || d.activities > 0).length;
    return {
      key, label: new Date(`${key}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }),
      entries, activeDays, minutes: entries.reduce((sum, d) => sum + d.minutes, 0),
      activities: entries.reduce((sum, d) => sum + d.activities, 0),
      coverage: entries.length ? Math.round(activeDays * 100 / entries.length) : 0,
    };
  });
}

export function moveCalendarSelection(days: readonly CalendarActivityDay[], selected: string | null, direction: -1 | 1) {
  const sorted = [...days].sort((a, b) => a.day.localeCompare(b.day));
  if (!sorted.length) return null;
  const index = sorted.findIndex(d => d.day === selected);
  const next = index < 0 ? (direction === 1 ? 0 : sorted.length - 1) : Math.max(0, Math.min(sorted.length - 1, index + direction));
  return sorted[next].day;
}
