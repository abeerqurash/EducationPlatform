import { WEEK_DAYS, type WeekDay, type WeeklyStudySchedule } from "./study-weekly-schedule";

export type RecordedStudyDay = { day: string; minutes: number; activities?: number };
export type StudyScheduleReality = {
  observedDays: number;
  observedWeeks: number;
  recordedMinutes: number;
  recordedWeeklyAverage: number;
  plannedWeeklyMinutes: number;
  differenceMinutes: number;
  daily: { day: WeekDay; plannedMinutes: number; recordedMinutes: number; recordedWeeklyAverage: number; observedOccurrences: number }[];
  note: string;
};

/** Compares a proposed recurring week with historical UTC activity, without claiming a plan was completed. */
export function compareScheduleWithHistory(schedule: WeeklyStudySchedule, history: readonly RecordedStudyDay[]): StudyScheduleReality {
  const totals = new Map<WeekDay, { minutes: number; count: number }>(WEEK_DAYS.map(day => [day, { minutes: 0, count: 0 }]));
  const uniqueDates = new Set<string>();
  for (const item of history) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.day)) continue;
    const date = new Date(`${item.day}T00:00:00.000Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== item.day || uniqueDates.has(item.day)) continue;
    uniqueDates.add(item.day);
    const weekday = WEEK_DAYS[(date.getUTCDay() + 6) % 7];
    const slot = totals.get(weekday)!;
    slot.minutes += Number.isFinite(item.minutes) && item.minutes > 0 ? Math.floor(item.minutes) : 0;
    slot.count++;
  }
  const observedDays = uniqueDates.size;
  const observedWeeks = observedDays / 7;
  const recordedMinutes = [...totals.values()].reduce((sum, item) => sum + item.minutes, 0);
  const recordedWeeklyAverage = observedWeeks ? Math.round(recordedMinutes / observedWeeks) : 0;
  const plan = new Map(schedule.entries.map(item => [item.day, item.minutes]));
  const daily = WEEK_DAYS.map(day => {
    const actual = totals.get(day)!;
    return { day, plannedMinutes: plan.get(day) ?? 0, recordedMinutes: actual.minutes, recordedWeeklyAverage: actual.count ? Math.round(actual.minutes / actual.count) : 0, observedOccurrences: actual.count };
  });
  const plannedWeeklyMinutes = schedule.entries.reduce((sum, item) => sum + item.minutes, 0);
  return { observedDays, observedWeeks: Math.round(observedWeeks * 100) / 100, recordedMinutes, recordedWeeklyAverage, plannedWeeklyMinutes, differenceMinutes: plannedWeeklyMinutes - recordedWeeklyAverage, daily, note: "Historical minutes are recorded activity from the selected UTC reporting window; the proposed schedule is not recorded or marked completed. Weekly historical average is normalized by observed days / 7." };
}

export function formatScheduleRealityText(report: StudyScheduleReality): string {
  return ["STUDY PLAN VS RECORDED ACTIVITY", "", `Observed UTC days: ${report.observedDays}`, `Recorded minutes: ${report.recordedMinutes}`, `Historical weekly average: ${report.recordedWeeklyAverage}`, `Proposed weekly minutes: ${report.plannedWeeklyMinutes}`, `Difference: ${report.differenceMinutes}`, "", ...report.daily.map(row => `${row.day}: proposed ${row.plannedMinutes} min | historical average ${row.recordedWeeklyAverage} min (${row.observedOccurrences} observations)`), "", report.note, ""].join("\n");
}

export function formatScheduleRealityCsv(report: StudyScheduleReality): string {
  return ["weekday,proposed_minutes,historical_weekday_average_minutes,recorded_minutes,observations", ...report.daily.map(row => `${row.day},${row.plannedMinutes},${row.recordedWeeklyAverage},${row.recordedMinutes},${row.observedOccurrences}`)].join("\r\n") + "\r\n";
}
