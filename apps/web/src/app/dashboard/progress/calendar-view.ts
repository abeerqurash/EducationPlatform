import type { CalendarCell } from "./activity-calendar";

export type CalendarViewMode = "all" | "active" | "target" | "missed";
export const DAILY_TARGET_OPTIONS = [15, 30, 45, 60, 90] as const;

/** Filter presentation only: summaries and streaks always use the full reporting period. */
export function visibleCalendarDays(days: readonly CalendarCell[], mode: CalendarViewMode, dailyTarget: number): CalendarCell[] {
  const target = Number.isFinite(dailyTarget) && dailyTarget > 0 ? dailyTarget : 30;
  switch (mode) {
    case "active": return days.filter(day => day.active);
    case "target": return days.filter(day => day.minutes >= target);
    case "missed": return days.filter(day => day.minutes < target);
    default: return [...days];
  }
}

export function summarizeDailyTarget(minutes: number, dailyTarget: number) {
  const target = Number.isFinite(dailyTarget) && dailyTarget > 0 ? Math.floor(dailyTarget) : 30;
  const recorded = Number.isFinite(minutes) ? Math.max(0, minutes) : 0;
  return { target, recorded, remaining: Math.max(0, target - recorded), exceeded: Math.max(0, recorded - target), achieved: recorded >= target, percent: Math.min(100, Math.round(recorded / target * 100)) };
}
