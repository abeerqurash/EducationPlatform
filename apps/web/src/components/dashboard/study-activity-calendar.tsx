"use client";

import { useState } from "react";
import { createActivityCalendar, type CalendarActivityDay } from "@/app/dashboard/progress/activity-calendar";

const LEVELS = ["bg-slate-100", "bg-violet-200", "bg-violet-400", "bg-violet-600", "bg-violet-800"] as const;

export function StudyActivityCalendar({ days }: { days: CalendarActivityDay[] }) {
  const calendar = createActivityCalendar(days);
  const [selected, setSelected] = useState<string | null>(null);
  const active = calendar.cells.find(day => day.day === selected) ?? null;
  return (
    <section aria-label="Study activity calendar" className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">Active days</p><p className="mt-1 text-xl font-extrabold text-slate-950">{calendar.activeDays} / {calendar.cells.length}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">Consistency</p><p className="mt-1 text-xl font-extrabold text-slate-950">{calendar.coverage}%</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">Study minutes</p><p className="mt-1 text-xl font-extrabold text-slate-950">{calendar.totalMinutes}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">Activities</p><p className="mt-1 text-xl font-extrabold text-slate-950">{calendar.totalActivities}</p></div>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Daily recorded activity, dates in UTC">
        {calendar.cells.map(day => <button key={day.day} type="button" onClick={() => setSelected(day.day)} aria-pressed={selected === day.day} aria-label={`${day.day}: ${day.minutes} study minutes, ${day.activities} activities`} title={`${day.day} · ${day.minutes} min · ${day.activities} activities`} className={`h-9 w-9 rounded-xl border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${selected === day.day ? "border-slate-900" : "border-transparent"} ${LEVELS[day.intensity]} hover:border-violet-500`} />)}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">Select a square to inspect its UTC date. Empty squares indicate no recorded activity.</p>
        <div className="flex items-center gap-1.5 text-xs text-slate-600" aria-label="Activity intensity from none to high"><span>Less</span>{LEVELS.map((level, index) => <span key={index} className={`h-4 w-4 rounded ${level}`} />)}<span>More</span></div>
      </div>
      <div aria-live="polite" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        {active ? <p><strong className="text-slate-950">{active.day} (UTC)</strong> · {active.minutes} recorded minutes · {active.activities} activities</p> : <p>Choose a date to view its recorded activity.</p>}
      </div>
    </section>
  );
}
