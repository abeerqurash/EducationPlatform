import type { CalendarActivityDay } from "@/app/dashboard/progress/activity-calendar";
import { summarizeCalendarMilestones } from "@/app/dashboard/progress/calendar-milestones";

export function StudyCalendarMilestones({ days, dailyTarget = 30 }: { days: CalendarActivityDay[]; dailyTarget?: number }) {
  const summary = summarizeCalendarMilestones(days, dailyTarget);
  return <section aria-label="Study consistency milestones" className="space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm font-extrabold text-slate-950">Consistency milestones</h3>
      <p className="text-xs text-slate-500">{summary.target}-minute daily benchmark · UTC dates</p>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold text-slate-500">Longest active-day streak</p>
        <p className="mt-2 text-2xl font-extrabold tabular-nums text-slate-950">{summary.longestStreak} <span className="text-sm font-semibold">days</span></p>
        <p className="mt-2 text-xs text-slate-600">{summary.longestStreakStart ? `${summary.longestStreakStart} to ${summary.longestStreakEnd}` : "No recorded activity in this period"}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold text-slate-500">Days meeting {summary.target} minutes</p>
        <p className="mt-2 text-2xl font-extrabold tabular-nums text-slate-950">{summary.targetDays} <span className="text-sm font-semibold">/ {summary.observedDays}</span></p>
        <p className="mt-2 text-xs text-slate-600">{summary.targetRate}% of observed days · longest target streak: {summary.longestTargetRun} days</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold text-slate-500">Daily benchmark progress</p>
        <p className="mt-2 text-2xl font-extrabold tabular-nums text-slate-950">{summary.targetProgress}%</p>
        <div role="progressbar" aria-label="Study minutes toward daily benchmarks" aria-valuemin={0} aria-valuemax={100} aria-valuenow={summary.targetProgress} className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-600" style={{ width: `${summary.targetProgress}%` }} /></div>
        <p className="mt-2 text-xs text-slate-600">{summary.achievedMinutes} of {summary.targetMinutes} benchmark minutes</p>
      </div>
    </div>
    <p className="text-xs text-slate-500">Benchmarks are informational, not assigned goals. Each date contributes at most {summary.target} minutes toward the benchmark; activity-only dates count toward active-day streaks.</p>
  </section>;
}
