/** UTC-only derived insights from the already authorized progress query. */
export type DailyStudyRecord = { day: string; minutes: number; activities: number };

export function summarizeStudyDays(days: readonly DailyStudyRecord[]) {
  let longestStreak = 0;
  let streak = 0;
  let currentStreak = 0;
  let totalMinutes = 0;
  let totalActivities = 0;
  let activeDays = 0;
  const weeks: { label: string; minutes: number; activities: number; activeDays: number; days: number }[] = [];
  days.forEach((day, index) => {
    totalMinutes += day.minutes;
    totalActivities += day.activities;
    if (day.activities > 0 || day.minutes > 0) {
      activeDays++;
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 0;
    }
    const weekIndex = Math.floor(index / 7);
    if (!weeks[weekIndex]) weeks.push({ label: `${day.day}`, minutes: 0, activities: 0, activeDays: 0, days: 0 });
    const week = weeks[weekIndex];
    week.minutes += day.minutes;
    week.activities += day.activities;
    week.activeDays += Number(day.activities > 0 || day.minutes > 0);
    week.days++;
    week.label = `${weeks[weekIndex].label.slice(0, 10)} to ${day.day}`;
  });
  // Streak ending on the final day of the selected UTC window.
  currentStreak = streak;
  return { longestStreak, currentStreak, totalMinutes, totalActivities, activeDays, weeks };
}
