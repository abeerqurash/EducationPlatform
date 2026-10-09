/** A bounded, UTC-day view of the recent records already loaded by Progress. */
export type CalendarRecentActivity = {
  id: string;
  title: string;
  activityType: string;
  durationMinutes: number | null;
  createdAt: string;
};

export function activityDetailsForDay(activities: readonly CalendarRecentActivity[], day: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(Date.parse(`${day}T00:00:00.000Z`))) return [];
  return activities.filter(activity => {
    const date = new Date(activity.createdAt);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === day;
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));
}

export function summarizeCalendarDayDetails(activities: readonly CalendarRecentActivity[]) {
  return {
    count: activities.length,
    sessions: activities.filter(activity => activity.activityType === "study_session").length,
    calculators: activities.filter(activity => activity.activityType !== "study_session").length,
    minutes: activities.reduce((sum, activity) => sum + (Number.isFinite(activity.durationMinutes) ? Math.max(0, activity.durationMinutes ?? 0) : 0), 0),
  };
}
