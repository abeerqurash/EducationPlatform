import type { CalendarActivityDay } from "./activity-calendar";

/** Study milestones derived exclusively from persisted daily totals. All dates are UTC. */
export function summarizeCalendarMilestones(days: readonly CalendarActivityDay[], dailyTarget = 30) {
  const target = Number.isFinite(dailyTarget) && dailyTarget > 0 ? Math.floor(dailyTarget) : 30;
  const ordered = [...days].filter(day => /^\d{4}-\d{2}-\d{2}$/.test(day.day)).sort((a, b) => a.day.localeCompare(b.day));
  let current = 0;
  let longest = 0;
  let longestStart: string | null = null;
  let longestEnd: string | null = null;
  let streakStart: string | null = null;
  let previousDay: string | null = null;
  let targetDays = 0;
  let totalTargetMinutes = 0;
  let achievedMinutes = 0;
  let longestTargetRun = 0;
  let targetRun = 0;
  let previousTargetDay: string | null = null;
  for (const day of ordered) {
    const minutes = Number.isFinite(day.minutes) ? Math.max(0, day.minutes) : 0;
    const active = minutes > 0 || (Number.isFinite(day.activities) && day.activities > 0);
    const consecutive = previousDay !== null && Date.parse(`${day.day}T00:00:00Z`) - Date.parse(`${previousDay}T00:00:00Z`) === 86400000;
    if (active) {
      current = consecutive ? current + 1 : 1;
      if (current === 1) streakStart = day.day;
      if (current > longest) { longest = current; longestStart = streakStart; longestEnd = day.day; }
    } else { current = 0; streakStart = null; }
    previousDay = day.day;
    totalTargetMinutes += target;
    achievedMinutes += Math.min(target, minutes);
    if (minutes >= target) {
      targetDays++;
      const consecutiveTarget = previousTargetDay !== null && Date.parse(`${day.day}T00:00:00Z`) - Date.parse(`${previousTargetDay}T00:00:00Z`) === 86400000;
      targetRun = consecutiveTarget ? targetRun + 1 : 1;
      longestTargetRun = Math.max(longestTargetRun, targetRun);
      previousTargetDay = day.day;
    } else { targetRun = 0; previousTargetDay = null; }
  }
  return {
    target, observedDays: ordered.length, targetDays,
    targetRate: ordered.length ? Math.round(targetDays / ordered.length * 100) : 0,
    targetMinutes: totalTargetMinutes, achievedMinutes,
    targetProgress: totalTargetMinutes ? Math.round(achievedMinutes / totalTargetMinutes * 100) : 0,
    longestStreak: longest, longestStreakStart: longestStart, longestStreakEnd: longestEnd,
    longestTargetRun,
  };
}
