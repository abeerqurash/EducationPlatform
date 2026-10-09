/** Pure UTC activity insights. A streak ends at today or yesterday, not an older day. */
export type OverviewActivityDay = { day: string; count: number; minutes: number };

export function summarizeOverviewActivity(days: readonly OverviewActivityDay[], todayUtc: string) {
  const dates = new Set(days.filter(day => day.count > 0).map(day => day.day));
  const today = /^\d{4}-\d{2}-\d{2}$/.test(todayUtc) ? new Date(`${todayUtc}T00:00:00.000Z`) : new Date(NaN);
  if (Number.isNaN(today.getTime())) return { streak: 0, activeDays: 0, minutes: 0 };
  const totalMinutes = days.reduce((sum, day) => sum + Math.max(0, day.minutes), 0);
  const activeDays = dates.size;
  const current = new Date(today);
  if (!dates.has(todayUtc)) current.setUTCDate(current.getUTCDate() - 1);
  let streak = 0;
  while (dates.has(current.toISOString().slice(0, 10)) && streak < days.length) {
    streak += 1;
    current.setUTCDate(current.getUTCDate() - 1);
  }
  return { streak, activeDays, minutes: totalMinutes };
}
