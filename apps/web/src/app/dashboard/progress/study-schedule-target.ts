import { WEEK_DAYS, type WeeklyStudySchedule } from "./study-weekly-schedule";

export type WeeklyTargetReview = {
  targetMinutes: number;
  plannedMinutes: number;
  differenceMinutes: number;
  coveragePercent: number;
  missingMinutes: number;
  additionalMinutesPerDay: number;
  status: "no-target" | "empty" | "below" | "met" | "above";
  guidance: string;
  daily: { day: string; minutes: number; sharePercent: number }[];
};

/** Advisory-only comparison: never records or modifies study activity. */
export function reviewWeeklyStudyTarget(schedule: WeeklyStudySchedule, target: number): WeeklyTargetReview {
  const targetMinutes = Number.isFinite(target) && target > 0 ? Math.min(10080, Math.floor(target)) : 0;
  const plannedMinutes = schedule.entries.reduce((sum, entry) => sum + (Number.isFinite(entry.minutes) && entry.minutes > 0 ? Math.floor(entry.minutes) : 0), 0);
  const differenceMinutes = plannedMinutes - targetMinutes;
  const missingMinutes = Math.max(0, -differenceMinutes);
  const additionalMinutesPerDay = schedule.entries.length ? Math.ceil(missingMinutes / schedule.entries.length) : 0;
  const status: WeeklyTargetReview["status"] = !targetMinutes ? "no-target" : !schedule.entries.length ? "empty" : differenceMinutes < 0 ? "below" : differenceMinutes === 0 ? "met" : "above";
  const guidance = status === "no-target" ? "Choose a positive weekly target to compare your plan." : status === "empty" ? "Select at least one study day to start planning toward your target." : status === "below" ? `Add ${missingMinutes} planned minutes across the week, approximately ${additionalMinutesPerDay} minutes per selected day, to reach your target.` : status === "met" ? "Your planned schedule matches your weekly target. Actual study time is tracked separately." : `Your plan exceeds the weekly target by ${differenceMinutes} minutes. Consider whether this workload is sustainable.`;
  const lookup = new Map(schedule.entries.map(entry => [entry.day, entry.minutes]));
  return { targetMinutes, plannedMinutes, differenceMinutes, coveragePercent: targetMinutes ? Math.min(999, Math.round(plannedMinutes / targetMinutes * 100)) : 0, missingMinutes, additionalMinutesPerDay, status, guidance, daily: WEEK_DAYS.map(day => ({ day, minutes: lookup.get(day) ?? 0, sharePercent: plannedMinutes ? Math.round((lookup.get(day) ?? 0) / plannedMinutes * 100) : 0 })) };
}

export function formatWeeklyTargetReviewText(review: WeeklyTargetReview): string {
  return ["WEEKLY STUDY TARGET REVIEW", "", `Weekly target: ${review.targetMinutes} minutes`, `Planned time: ${review.plannedMinutes} minutes`, `Difference: ${review.differenceMinutes} minutes`, `Coverage: ${review.coveragePercent}%`, `Status: ${review.status}`, "", review.guidance, "", ...review.daily.map(day => `${day.day}: ${day.minutes} planned minutes (${day.sharePercent}% of plan)`), "", "Planned time is not recorded study activity.", ""].join("\n");
}

export function formatWeeklyTargetReviewCsv(review: WeeklyTargetReview): string {
  return ["day,planned_minutes,share_percent,weekly_target_minutes", ...review.daily.map(day => `${day.day},${day.minutes},${day.sharePercent},${review.targetMinutes}`)].join("\r\n") + "\r\n";
}
