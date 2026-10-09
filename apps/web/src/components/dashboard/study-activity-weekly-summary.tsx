"use client";

import { summarizeActivityWeeks } from "@/app/dashboard/progress/calendar-weeks";
import type { CalendarActivityDay } from "@/app/dashboard/progress/activity-calendar";

export function StudyActivityWeeklySummary({ days, onSelectDay }: { days: CalendarActivityDay[]; onSelectDay: (day: string) => void }) {
  const weeks = summarizeActivityWeeks(days);
  if (!weeks.length) return <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No weekly activity data in this reporting period.</p>;
  const highest = Math.max(1, ...weeks.map(week => week.minutes));
  return <section aria-label="Weekly study activity summary" className="space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-extrabold text-slate-950">Weekly breakdown</h3><p className="text-xs text-slate-500">UTC weeks begin Monday · partial weeks included</p></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {weeks.map(week => <div key={week.start} className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-2"><p className="text-xs font-bold text-slate-700">Week of {week.start}</p><span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold tabular-nums text-violet-800">{week.minutes} min</span></div>
        <div role="img" aria-label={`${week.minutes} minutes recorded this week`} className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-600" style={{ width: `${week.minutes / highest * 100}%` }} /></div>
        <p className="mt-3 text-xs text-slate-600">{week.activeDays}/{week.observedDays} active days · {week.activities} activities</p>
        <p className="mt-1 text-xs text-slate-600">{week.averageMinutes} min per observed day</p>
        {week.changeMinutes !== null && <p className="mt-1 text-xs font-semibold text-slate-700">{week.comparable ? `${week.changeMinutes >= 0 ? "+" : ""}${week.changeMinutes} min vs previous week` : "Partial-week comparison unavailable"}</p>}
        {week.busiestDay && <button type="button" onClick={() => onSelectDay(week.busiestDay!)} className="mt-3 inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 transition hover:border-violet-400 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">Inspect {week.busiestDay}</button>}
      </div>)}
    </div>
  </section>;
}
