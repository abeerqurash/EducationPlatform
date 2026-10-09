"use client";

import { useMemo, useState } from "react";
import type { StudyActionPlan } from "@/app/dashboard/progress/study-action-plan";
import { buildWeeklyStudySchedule, formatWeeklyStudyScheduleText, weeklyStudyScheduleFilename, WEEK_DAYS, type WeekDay } from "@/app/dashboard/progress/study-weekly-schedule";
import { formatWeeklyScheduleCsv, formatWeeklyScheduleIcs } from "@/app/dashboard/progress/study-schedule-exports";
import { STUDY_SCHEDULE_PRESETS, findStudySchedulePreset, formatWeeklySchedulePrintableHtml } from "@/app/dashboard/progress/study-schedule-presets";
import { summarizeWeeklySchedule, formatWeeklyScheduleInsightsText } from "@/app/dashboard/progress/study-schedule-insights";
import { compareStudySchedules, formatStudyScheduleComparisonText, formatStudyScheduleComparisonCsv } from "@/app/dashboard/progress/study-schedule-comparison";
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
  const [dayMinutes, setDayMinutes] = useState<Partial<Record<WeekDay, number>>>({});
  const [startHour, setStartHour] = useState(9);
  const [comparisonPreset, setComparisonPreset] = useState("weekdays");
  const [feedback, setFeedback] = useState("");
  const schedule = useMemo(() => buildWeeklyStudySchedule(plan, days, minutes, dayMinutes), [plan, days, minutes, dayMinutes]);
  const text = formatWeeklyStudyScheduleText(schedule);
  const insights = summarizeWeeklySchedule(schedule);
  const referencePreset = findStudySchedulePreset(comparisonPreset) ?? STUDY_SCHEDULE_PRESETS[0];
  const referenceSchedule = buildWeeklyStudySchedule(plan, referencePreset.days, referencePreset.minutes, referencePreset.overrides);
  const comparison = compareStudySchedules(schedule, referenceSchedule, referencePreset.title);

  return <section aria-label="Weekly study schedule" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h3 className="text-sm font-extrabold text-slate-950">Build a seven-day schedule</h3><p className="mt-1 text-xs leading-5 text-slate-600">Choose study days and a daily target. This is a plan only; it does not log sessions or modify saved goals.</p></div>
      <ThemedExportSelect name="weeklyMinutes" label="Minutes per study day" defaultValue="30" value={String(minutes)} onValueChange={value => { setMinutes(Number(value)); setFeedback(""); }} options={[15, 30, 45, 60, 90, 120].map(value => ({ value: String(value), label: `${value} minutes` }))} />
    </div>
    <div className="space-y-2" aria-label="Quick study schedule presets"><p className="text-xs font-bold text-slate-800">Quick schedule templates</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{STUDY_SCHEDULE_PRESETS.map(preset => <button key={preset.id} type="button" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:border-violet-400 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600" onClick={() => { const chosen = findStudySchedulePreset(preset.id); if (!chosen) return; setDays([...chosen.days]); setMinutes(chosen.minutes); setDayMinutes({ ...chosen.overrides }); setFeedback(`${chosen.title} template applied. You can still customize every day.`); }}><span className="block text-xs font-extrabold text-slate-900">{preset.title}</span><span className="mt-1 block text-xs text-slate-600">{preset.description}</span></button>)}</div></div>
    <div className="flex flex-wrap items-end gap-3"><ThemedExportSelect name="calendarStartHour" label="Calendar start (UTC)" defaultValue="9" value={String(startHour)} onValueChange={value => { setStartHour(Number(value)); setFeedback(""); }} options={[8, 9, 12, 15, 17, 19].map(value => ({ value: String(value), label: `${String(value).padStart(2, "0")}:00 UTC` }))} /><p className="max-w-lg text-xs leading-5 text-slate-500">Calendar download schedules the next Monday–Sunday week, at your selected UTC time. Imported events are tentative plans, not completed activity.</p></div>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7" aria-label="Choose study days">
      {WEEK_DAYS.map(day => {
        const active = days.includes(day);
        return <button key={day} type="button" aria-pressed={active} onClick={() => { setDays(previous => active ? previous.filter(item => item !== day) : [...previous, day]); setFeedback(""); }} className={`min-h-11 rounded-xl border px-3 py-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${active ? "border-violet-400 bg-violet-100 text-violet-900" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-violet-300"}`}>{day}</button>;
      })}
    </div>
    {schedule.entries.length > 0 && <div className="space-y-2" aria-label="Individual study day durations">
      <p className="text-xs font-bold text-slate-800">Customize minutes per day</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{schedule.entries.map(entry => <div key={entry.day} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div><p className="text-xs font-bold text-slate-900">{entry.day}</p><p className="text-xs text-slate-600">{entry.minutes} minutes</p></div>
        <div className="flex items-center gap-1">
          <button type="button" aria-label={`Decrease ${entry.day} by 15 minutes`} disabled={entry.minutes <= 15} className={actionClass} onClick={() => { setDayMinutes(previous => ({ ...previous, [entry.day]: Math.max(15, entry.minutes - 15) })); setFeedback(""); }}>−15</button>
          <button type="button" aria-label={`Increase ${entry.day} by 15 minutes`} disabled={entry.minutes >= 720} className={actionClass} onClick={() => { setDayMinutes(previous => ({ ...previous, [entry.day]: Math.min(720, entry.minutes + 15) })); setFeedback(""); }}>+15</button>
        </div>
      </div>)}</div>
      <button type="button" className={actionClass} onClick={() => { setDayMinutes({}); setFeedback("Daily durations reset to the default."); }}>Use default duration for every day</button>
    </div>}
    <div className="flex flex-wrap gap-2"><span className="rounded-full bg-violet-50 px-3 py-2 text-xs font-bold text-violet-800">{schedule.scheduledDays} planned days</span><span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800">{schedule.scheduledMinutes} planned minutes</span></div>
    <section aria-label="Weekly schedule review" className="space-y-3 rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-extrabold text-slate-950">Weekly schedule review</h4><button type="button" className={actionClass} onClick={() => { download(formatWeeklyScheduleInsightsText(insights), "weekly-schedule-review.txt", "text/plain;charset=utf-8"); setFeedback("Schedule review prepared."); }}>Download review</button></div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[{ label: "Planned hours", value: `${insights.totalHours} h` }, { label: "Average session", value: `${insights.averageMinutes} min` }, { label: "Longest session", value: `${insights.longestSession} min` }, { label: "Rest days", value: String(insights.restDays.length) }].map(item => <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs text-slate-600">{item.label}</p><p className="mt-1 text-lg font-extrabold text-slate-950">{item.value}</p></div>)}
      </div>
      <div aria-label="Planned minutes by weekday" className="grid grid-cols-7 gap-1">{insights.dailyShare.map(item => <div key={item.day} className="min-w-0 text-center"><div className="flex h-20 items-end rounded-lg bg-white p-1"><div className="w-full rounded bg-violet-500" style={{ height: `${item.minutes ? Math.max(6, item.percent) : 0}%` }} /></div><p className="mt-1 text-[10px] font-bold text-slate-700">{item.day.slice(0, 3)}</p><p className="text-[10px] text-slate-600">{item.minutes}m</p></div>)}</div>
      <ul className="space-y-1 text-xs leading-5 text-slate-700">{insights.notices.map(notice => <li key={notice}>• {notice}</li>)}</ul>
      <p className="text-xs text-slate-500">These metrics describe planned sessions only, not completed activity.</p>
    </section>
    <section aria-label="Compare study schedules" className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="text-sm font-extrabold text-slate-950">Compare with a schedule template</h4>
      <p className="text-xs text-slate-600">See how your custom schedule differs from a reference template. This comparison does not modify your plan.</p>
      <ThemedExportSelect name="comparisonPreset" label="Reference template" defaultValue="weekdays" value={comparisonPreset} onValueChange={value => { setComparisonPreset(value); setFeedback(""); }} options={STUDY_SCHEDULE_PRESETS.map(preset => ({ value: preset.id, label: preset.title }))} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{[{ label: "Your planned time", value: `${comparison.plannedMinutes} min` }, { label: "Template time", value: `${comparison.baselineMinutes} min` }, { label: "Weekly difference", value: `${comparison.differenceMinutes > 0 ? "+" : ""}${comparison.differenceMinutes} min` }].map(item => <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs text-slate-600">{item.label}</p><p className="mt-1 text-base font-extrabold text-slate-900">{item.value}</p></div>)}</div>
      <p className="text-xs font-semibold text-slate-800">{comparison.summary}</p>
      <p className="text-xs text-slate-600">Added days: {comparison.daysAdded.join(", ") || "None"} · Removed days: {comparison.daysRemoved.join(", ") || "None"}</p>
      {comparison.daysChanged.length > 0 && <ul className="space-y-1 text-xs text-slate-700">{comparison.daysChanged.map(item => <li key={item.day}>{item.day}: {item.baseline} → {item.planned} minutes</li>)}</ul>}
      <div className="flex flex-wrap gap-2"><button type="button" className={actionClass} onClick={() => { download(formatStudyScheduleComparisonText(comparison), "study-schedule-comparison.txt", "text/plain;charset=utf-8"); setFeedback("Comparison TXT prepared."); }}>Download comparison TXT</button><button type="button" className={actionClass} onClick={() => { download(formatStudyScheduleComparisonCsv(comparison), "study-schedule-comparison.csv", "text/csv;charset=utf-8"); setFeedback("Comparison CSV prepared."); }}>Download comparison CSV</button></div>
    </section>
    <ol className="space-y-2" aria-label="Planned study sessions">{schedule.entries.map(entry => <li key={entry.day} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-extrabold text-slate-900">{entry.day} · {entry.minutes} min</p><p className="mt-1 text-xs leading-5 text-slate-600">{entry.action}</p></li>)}</ol>
    {!schedule.entries.length && <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-600">Select at least one day to create a weekly schedule.</p>}
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={!schedule.entries.length} className={actionClass} onClick={() => { download(text, weeklyStudyScheduleFilename("txt"), "text/plain;charset=utf-8"); setFeedback("TXT schedule prepared."); }}>Download TXT</button>
      <button type="button" disabled={!schedule.entries.length} className={actionClass} onClick={() => { download(JSON.stringify(schedule, null, 2) + "\n", weeklyStudyScheduleFilename("json"), "application/json;charset=utf-8"); setFeedback("JSON schedule prepared."); }}>Download JSON</button>
      <button type="button" disabled={!schedule.entries.length} className={actionClass} onClick={() => { download(formatWeeklyScheduleCsv(schedule), "weekly-study-schedule.csv", "text/csv;charset=utf-8"); setFeedback("CSV schedule prepared."); }}>Download CSV</button>
      <button type="button" disabled={!schedule.entries.length} className={actionClass} onClick={() => { download(formatWeeklySchedulePrintableHtml(schedule), "weekly-study-planner.html", "text/html;charset=utf-8"); setFeedback("Printable planner prepared. Open the HTML file and use your browser Print command."); }}>Download printable planner</button>
      <button type="button" disabled={!schedule.entries.length} className={actionClass} onClick={() => { download(formatWeeklyScheduleIcs(schedule, new Date(), startHour), "weekly-study-schedule.ics", "text/calendar;charset=utf-8"); setFeedback("Calendar file prepared for the next UTC week."); }}>Download calendar (.ics)</button>
      <button type="button" disabled={!schedule.entries.length} className={actionClass} onClick={() => { void navigator.clipboard.writeText(text).then(() => setFeedback("Schedule copied.")).catch(() => setFeedback("Clipboard unavailable. Use TXT download.")); }}>Copy schedule</button>
      <button type="button" className={actionClass} onClick={() => { setDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]); setMinutes(30); setDayMinutes({}); setStartHour(9); setFeedback("Schedule reset."); }}>Reset schedule</button>
    </div>
    <p aria-live="polite" className="text-xs text-slate-600">{feedback}</p>
    <p className="text-xs text-slate-500">{schedule.note} This schedule is generated locally and is not stored in your account.</p>
  </section>;
}
