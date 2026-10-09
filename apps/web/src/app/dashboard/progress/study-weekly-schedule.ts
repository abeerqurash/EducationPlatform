import type { StudyActionPlan } from "./study-action-plan";

export const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];
export type WeeklyStudySchedule = {
  version: 1;
  benchmarkMinutes: number;
  scheduledMinutes: number;
  scheduledDays: number;
  entries: { day: WeekDay; minutes: number; action: string }[];
  note: string;
};

export function buildWeeklyStudySchedule(plan: StudyActionPlan, selectedDays: readonly WeekDay[], minutesPerDay: number): WeeklyStudySchedule {
  const allowed = new Set(selectedDays.filter(day => WEEK_DAYS.includes(day)));
  const safeMinutes = Number.isFinite(minutesPerDay) && minutesPerDay > 0 ? Math.min(720, Math.floor(minutesPerDay)) : 30;
  const actions = plan.actions.map(item => item.nextStep);
  const entries = WEEK_DAYS.filter(day => allowed.has(day)).map((day, index) => ({
    day,
    minutes: safeMinutes,
    action: actions.length ? actions[index % actions.length] : "Review your learning goals and record a focused study session.",
  }));
  return {
    version: 1,
    benchmarkMinutes: plan.benchmarkMinutes,
    scheduledMinutes: entries.length * safeMinutes,
    scheduledDays: entries.length,
    entries,
    note: "This is a proposed weekly schedule, not recorded study activity. Adjust it to your needs.",
  };
}

export function formatWeeklyStudyScheduleText(schedule: WeeklyStudySchedule): string {
  return [
    "WEEKLY STUDY SCHEDULE", "",
    `Planned days: ${schedule.scheduledDays}`,
    `Planned minutes: ${schedule.scheduledMinutes}`,
    `Activity benchmark: ${schedule.benchmarkMinutes} minutes`, "",
    ...schedule.entries.map(entry => `${entry.day}: ${entry.minutes} minutes — ${entry.action}`),
    ...(schedule.entries.length ? [] : ["No days selected."]),
    "", schedule.note, "",
  ].join("\n");
}

export function weeklyStudyScheduleFilename(extension: "txt" | "json"): string {
  return `weekly-study-schedule.${extension}`;
}
