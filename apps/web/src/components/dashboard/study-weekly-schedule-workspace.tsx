"use client";

import { useMemo, useState } from "react";
import type { StudyActionPlan } from "@/app/dashboard/progress/study-action-plan";
import { buildWeeklyStudySchedule, formatWeeklyStudyScheduleText, weeklyStudyScheduleFilename, WEEK_DAYS, type WeekDay } from "@/app/dashboard/progress/study-weekly-schedule";
import { ThemedExportSelect } from "@/components/shared/themed-export-select";

const actionClass = "inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 transition-colors hover:border-violet-400 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-50";

function download(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function StudyWeeklyScheduleWorkspace({ plan }: { plan: StudyActionPlan }) {
  const [days, setDays] = useState<WeekDay[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [minutes, setMinutes] = useState(30);
  const [feedback, setFeedback] = useState("");
  const schedule = useMemo(() => buildWeeklyStudySchedule(plan, days, minutes), [plan, days, minutes]);
  const text = formatWeeklyStudyScheduleText(schedule);

  return <section aria-label="Weekly study schedule" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h3 className="text-sm font-extrabold text-slate-950">Build a seven-day schedule</h3><p className="mt-1 text-xs leading-5 text-slate-600">Choose study days and a daily target. This is a plan only; it does not log sessions or modify saved goals.</p></div>
      <ThemedExportSelect name="weeklyMinutes" label="Minutes per study day" defaultValue="30" value={String(minutes)} onValueChange={value => { setMinutes(Number(value)); setFeedback(""); }} options={[15, 30, 45, 60, 90, 120].map(value => ({ value: String(value), label: `${value} minutes` }))} />
    </div>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7" aria-label="Choose study days">
      {WEEK_DAYS.map(day => {
        const active = days.includes(day);
        return <button key={day} type="button" aria-pressed={active} onClick={() => { setDays(previous => active ? previous.filter(item => item !== day) : [...previous, day]); setFeedback(""); }} className={`min-h-11 rounded-xl border px-3 py-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${active ? "border-violet-400 bg-violet-100 text-violet-900" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-violet-300"}`}>{day}</button>;
      })}
    </div>
    <div className="flex flex-wrap gap-2"><span className="rounded-full bg-violet-50 px-3 py-2 text-xs font-bold text-violet-800">{schedule.scheduledDays} planned days</span><span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800">{schedule.scheduledMinutes} planned minutes</span></div>
    <ol className="space-y-2" aria-label="Planned study sessions">{schedule.entries.map(entry => <li key={entry.day} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-extrabold text-slate-900">{entry.day} · {entry.minutes} min</p><p className="mt-1 text-xs leading-5 text-slate-600">{entry.action}</p></li>)}</ol>
    {!schedule.entries.length && <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-600">Select at least one day to create a weekly schedule.</p>}
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={!schedule.entries.length} className={actionClass} onClick={() => { download(text, weeklyStudyScheduleFilename("txt"), "text/plain;charset=utf-8"); setFeedback("TXT schedule prepared."); }}>Download TXT</button>
      <button type="button" disabled={!schedule.entries.length} className={actionClass} onClick={() => { download(JSON.stringify(schedule, null, 2) + "\n", weeklyStudyScheduleFilename("json"), "application/json;charset=utf-8"); setFeedback("JSON schedule prepared."); }}>Download JSON</button>
      <button type="button" className={actionClass} onClick={() => { setDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]); setMinutes(30); setFeedback("Schedule reset."); }}>Reset schedule</button>
    </div>
    <p aria-live="polite" className="text-xs text-slate-600">{feedback}</p>
    <p className="text-xs text-slate-500">{schedule.note} This schedule is generated locally and is not stored in your account.</p>
  </section>;
}
