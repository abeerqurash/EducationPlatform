"use client";

import { useState } from "react";
import { createActivityCalendar, type CalendarActivityDay } from "@/app/dashboard/progress/activity-calendar";
import { groupActivityMonths, moveCalendarSelection } from "@/app/dashboard/progress/calendar-months";
import { StudyActivityWeeklySummary } from "@/components/dashboard/study-activity-weekly-summary";
import { activityDetailsForDay, summarizeCalendarDayDetails, type CalendarRecentActivity } from "@/app/dashboard/progress/calendar-day-details";

const LEVELS = ["bg-slate-100", "bg-violet-200", "bg-violet-400", "bg-violet-600", "bg-violet-800"] as const;

export function StudyActivityCalendar({ days, recentActivities = [] }: { days: CalendarActivityDay[]; recentActivities?: CalendarRecentActivity[] }) {
  const calendar = createActivityCalendar(days);
  const months = groupActivityMonths(calendar.cells);
  const orderedDays = months.flatMap(month => month.entries);
  const [selected, setSelected] = useState<string | null>(null);
  const active = calendar.cells.find(day => day.day === selected) ?? null;
  const dayRecords = active ? activityDetailsForDay(recentActivities, active.day) : [];
  const daySummary = summarizeCalendarDayDetails(dayRecords);
  return (
    <section aria-label="Study activity calendar" className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">Active days</p><p className="mt-1 text-xl font-extrabold text-slate-950">{calendar.activeDays} / {calendar.cells.length}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">Consistency</p><p className="mt-1 text-xl font-extrabold text-slate-950">{calendar.coverage}%</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">Study minutes</p><p className="mt-1 text-xl font-extrabold text-slate-950">{calendar.totalMinutes}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">Activities</p><p className="mt-1 text-xl font-extrabold text-slate-950">{calendar.totalActivities}</p></div>
      </div>
      <div className="space-y-4">
        {months.map(month => <div key={month.key} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-extrabold text-slate-950">{month.label}</h3><p className="text-xs text-slate-500">{month.activeDays}/{month.entries.length} active · {month.minutes} min · {month.coverage}% consistency</p></div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={`Recorded activity in ${month.label}, UTC`}>
            {month.entries.map(day => <button key={day.day} type="button" onClick={() => setSelected(day.day)} aria-pressed={selected === day.day} aria-label={`${day.day}: ${day.minutes} study minutes, ${day.activities} activities`} title={`${day.day} · ${day.minutes} min · ${day.activities} activities`} className={`h-9 w-9 rounded-xl border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${selected === day.day ? "border-slate-900" : "border-transparent"} ${LEVELS[day.intensity]} hover:border-violet-500`} />)}
          </div>
        </div>)}
        {!months.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No recorded dates in this period.</p>}
      </div>
      <StudyActivityWeeklySummary days={calendar.cells} onSelectDay={setSelected} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">Select a square to inspect its UTC date. Empty squares indicate no recorded activity.</p>
        <div className="flex items-center gap-1.5 text-xs text-slate-600" aria-label="Activity intensity from none to high"><span>Less</span>{LEVELS.map((level, index) => <span key={index} className={`h-4 w-4 rounded ${level}`} />)}<span>More</span></div>
      </div>
      <div aria-live="polite" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        {active ? <p><strong className="text-slate-950">{active.day} (UTC)</strong> · {active.minutes} recorded minutes · {active.activities} activities</p> : <p>Choose a date to view its recorded activity.</p>}
      </div>
      {active && <section aria-label="Selected date recent activity" className="rounded-2xl border border-[#dfe0d5] bg-[#f7f8f2] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div><h3 className="text-sm font-extrabold text-[#171912]">Activity details · {active.day}</h3><p className="mt-1 text-xs text-slate-600">Recent records loaded for this UTC date</p></div>
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#171912]">{daySummary.count} records · {daySummary.minutes} min</span>
        </div>
        {dayRecords.length ? <>
          <p className="mt-3 text-xs font-semibold text-slate-600">{daySummary.sessions} study sessions · {daySummary.calculators} calculator activities</p>
          <ol className="mt-3 divide-y divide-[#e1e3d9]">{dayRecords.map(activity => <li key={activity.id} className="flex items-start justify-between gap-3 py-3">
            <div className="min-w-0"><p className="break-words text-sm font-bold text-[#171912]">{activity.title}</p><p className="mt-1 text-xs text-slate-600">{activity.activityType === "study_session" ? "Study session" : "Calculator activity"} · {new Date(activity.createdAt).toLocaleTimeString("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit" })} UTC</p></div>
            <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold tabular-nums text-[#171912]">{activity.durationMinutes ?? 0} min</span>
          </li>)}</ol>
        </> : <p className="mt-3 rounded-xl bg-white px-4 py-4 text-sm text-slate-600">No individual records are available for this date in the recent activity window. The daily totals above still reflect the selected reporting period.</p>}
        <p className="mt-3 text-xs text-slate-500">Individual records come from the bounded recent seven-day history and may not cover older dates or every record. The calendar totals are calculated separately from the selected reporting period.</p>
      </section>}
      <div className="flex flex-wrap gap-2" aria-label="Calendar quick actions">
        <button type="button" disabled={!calendar.busiest} onClick={() => setSelected(calendar.busiest?.day ?? null)} className="inline-flex min-h-11 items-center rounded-full border border-violet-200 bg-violet-50 px-4 text-xs font-bold text-violet-900 transition hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 disabled:opacity-40">Jump to busiest day</button>
        <button type="button" disabled={!selected} onClick={() => setSelected(null)} className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 disabled:opacity-40">Clear selection</button>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Selected date navigation">
        <button type="button" disabled={!orderedDays.length || selected === orderedDays[0]?.day} onClick={() => setSelected(moveCalendarSelection(orderedDays, selected, -1))} className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 transition hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 disabled:opacity-40">Previous day</button>
        <button type="button" disabled={!orderedDays.length || selected === orderedDays.at(-1)?.day} onClick={() => setSelected(moveCalendarSelection(orderedDays, selected, 1))} className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 transition hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600 disabled:opacity-40">Next day</button>
      </div>
    </section>
  );
}
