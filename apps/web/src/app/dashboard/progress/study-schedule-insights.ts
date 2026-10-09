import { WEEK_DAYS, type WeeklyStudySchedule, type WeekDay } from "./study-weekly-schedule";

export type WeeklyScheduleInsights = {
  totalHours: number;
  averageMinutes: number;
  longestSession: number;
  shortestSession: number;
  restDays: WeekDay[];
  longestStudyStreak: number;
  longestRestStreak: number;
  dailyShare: { day: WeekDay; minutes: number; percent: number }[];
  notices: string[];
};

/** Pure, deterministic schedule analytics. These are plans, never logged sessions. */
export function summarizeWeeklySchedule(schedule: WeeklyStudySchedule): WeeklyScheduleInsights {
  const byDay = new Map(schedule.entries.map(entry => [entry.day, Math.max(0, Number.isFinite(entry.minutes) ? entry.minutes : 0)]));
  const dailyShare = WEEK_DAYS.map(day => ({ day, minutes: byDay.get(day) ?? 0, percent: 0 }));
  const total = dailyShare.reduce((sum, day) => sum + day.minutes, 0);
  for (const item of dailyShare) item.percent = total > 0 ? Math.round((item.minutes / total) * 100) : 0;
  const active = dailyShare.filter(day => day.minutes > 0);
  const restDays = dailyShare.filter(day => day.minutes === 0).map(day => day.day);
  let studyStreak = 0, restStreak = 0, longestStudyStreak = 0, longestRestStreak = 0;
  for (const day of dailyShare) {
    if (day.minutes > 0) { studyStreak++; restStreak = 0; }
    else { restStreak++; studyStreak = 0; }
    longestStudyStreak = Math.max(longestStudyStreak, studyStreak);
    longestRestStreak = Math.max(longestRestStreak, restStreak);
  }
  const minutes = active.map(day => day.minutes);
  const notices: string[] = [];
  if (!active.length) notices.push("Choose a study day to build your weekly plan.");
  else {
    if (restDays.length === 0) notices.push("You have scheduled every day. Consider whether a rest day would support your routine.");
    if (Math.max(...minutes) > 180) notices.push("At least one session exceeds three hours. Consider shorter sessions with breaks.");
    if (active.length >= 2 && Math.max(...minutes) >= Math.min(...minutes) * 3) notices.push("Daily durations vary substantially. Check whether this balance is intentional.");
    if (!notices.length) notices.push("Your selected study days and durations are ready to review.");
  }
  return {
    totalHours: Math.round(total / 60 * 100) / 100,
    averageMinutes: active.length ? Math.round(total / active.length) : 0,
    longestSession: minutes.length ? Math.max(...minutes) : 0,
    shortestSession: minutes.length ? Math.min(...minutes) : 0,
    restDays,
    longestStudyStreak,
    longestRestStreak,
    dailyShare,
    notices,
  };
}

export function formatWeeklyScheduleInsightsText(insights: WeeklyScheduleInsights): string {
  return [
    "WEEKLY SCHEDULE REVIEW", "",
    `Planned hours: ${insights.totalHours}`,
    `Average planned session: ${insights.averageMinutes} minutes`,
    `Longest planned session: ${insights.longestSession} minutes`,
    `Shortest planned session: ${insights.shortestSession} minutes`,
    `Longest consecutive study days: ${insights.longestStudyStreak}`,
    `Longest consecutive rest days: ${insights.longestRestStreak}`,
    `Rest days: ${insights.restDays.join(", ") || "None"}`, "",
    ...insights.notices.map(notice => `- ${notice}`), "",
    "Planned schedule only. No completed study activity is implied.", "",
  ].join("\n");
}
