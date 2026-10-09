/** Pure UTC calendar model. Does not infer activity from missing records. */
export type CalendarActivityDay = { day: string; minutes: number; activities: number };
export type CalendarCell = CalendarActivityDay & { intensity: 0 | 1 | 2 | 3 | 4; active: boolean };

export function activityIntensity(minutes: number, activities: number): 0 | 1 | 2 | 3 | 4 {
  if (!Number.isFinite(minutes) || !Number.isFinite(activities) || (minutes <= 0 && activities <= 0)) return 0;
  if (minutes >= 120) return 4;
  if (minutes >= 60) return 3;
  if (minutes >= 25) return 2;
  return 1;
}

export function createActivityCalendar(days: readonly CalendarActivityDay[]) {
  const cells: CalendarCell[] = days.map(({ day, minutes, activities }) => ({
    day, minutes: Math.max(0, Number.isFinite(minutes) ? minutes : 0),
    activities: Math.max(0, Number.isFinite(activities) ? activities : 0),
    intensity: activityIntensity(minutes, activities), active: minutes > 0 || activities > 0,
  }));
  const activeDays = cells.filter(cell => cell.active).length;
  const totalMinutes = cells.reduce((sum, cell) => sum + cell.minutes, 0);
  const totalActivities = cells.reduce((sum, cell) => sum + cell.activities, 0);
  const busiest = cells.reduce<CalendarCell | null>((best, cell) => !best || cell.minutes > best.minutes ? cell : best, null);
  return { cells, activeDays, totalMinutes, totalActivities, busiest, coverage: cells.length ? Math.round(activeDays / cells.length * 100) : 0 };
}
