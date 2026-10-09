"use client";

import { useMemo, useState } from "react";
import { buildStudyActionPlan, formatStudyActionPlanText, studyActionPlanFilename } from "@/app/dashboard/progress/study-action-plan";
import { summarizeLearningRecommendations, type LearningDay } from "@/app/dashboard/progress/learning-recommendations";
import { ThemedExportSelect } from "@/components/shared/themed-export-select";
import { StudyWeeklyScheduleWorkspace } from "@/components/dashboard/study-weekly-schedule-workspace";

const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 transition-colors hover:border-violet-400 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-50";

function saveFile(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function StudyActionPlanWorkspace({ days, weeklyTarget = 300 }: { days: LearningDay[]; weeklyTarget?: number }) {
  const [benchmark, setBenchmark] = useState(30);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const report = useMemo(() => summarizeLearningRecommendations(days, benchmark), [days, benchmark]);
  const selected = report.recommendations.filter(item => !excluded.includes(item.id));
  const plan = buildStudyActionPlan(days, benchmark, selected.map(item => item.id));
  const plainText = formatStudyActionPlanText(plan);

  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(plainText);
      setStatus("Study action plan copied.");
    } catch {
      setStatus("Clipboard unavailable. Use TXT download instead.");
    }
  }

  return <section aria-label="Study action plan" className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h3 className="text-sm font-extrabold text-slate-950">Your next steps</h3><p className="mt-1 text-xs text-slate-500">Choose suggestions to include in a private, downloadable plan. Selections are not saved to your account.</p></div>
      <ThemedExportSelect name="actionBenchmark" label="Daily benchmark" defaultValue="30" value={String(benchmark)} onValueChange={value => { setBenchmark(Number(value)); setExcluded([]); setStatus(""); }} options={[15, 30, 45, 60, 90].map(value => ({ value: String(value), label: `${value} minutes` }))} />
    </div>
    <div className="grid gap-3 lg:grid-cols-3">
      {report.recommendations.map(item => {
        const checked = !excluded.includes(item.id);
        return <label key={item.id} className={`flex cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition-colors ${checked ? "border-violet-300 bg-violet-50/50" : "border-slate-200 bg-white"}`}>
          <span className="flex items-center gap-2"><input type="checkbox" checked={checked} onChange={() => { setExcluded(old => checked ? [...old, item.id] : old.filter(id => id !== item.id)); setStatus(""); }} className="peer sr-only" /><span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-violet-400 bg-white text-xs font-extrabold text-white peer-checked:border-violet-700 peer-checked:bg-violet-700 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet-700">{checked ? "✓" : ""}</span><span className="text-xs font-extrabold text-slate-900">{item.title}</span></span>
          <span className="text-xs leading-5 text-slate-600">{item.detail}</span>
          <span className="mt-auto text-xs font-bold text-violet-800">Next step: {item.action}</span>
        </label>;
      })}
    </div>
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-extrabold text-slate-950">Plan preview</p><span className="text-xs font-bold text-slate-600">{selected.length} of {report.recommendations.length} actions selected</span></div>
      <p className="mt-2 text-xs text-slate-600">{plan.period.startUtc ?? "No records"} – {plan.period.endUtc ?? "No records"} (UTC) · {plan.summary.totalMinutes} recorded minutes · {plan.summary.activeDays} active days</p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs font-semibold text-slate-800">{selected.map(item => <li key={item.id}>{item.action}</li>)}</ol>
      {!selected.length && <p className="mt-3 text-xs text-slate-500">Select at least one action to export your plan.</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={!selected.length} className={buttonClass} onClick={() => { saveFile(plainText, studyActionPlanFilename(plan, "txt"), "text/plain;charset=utf-8"); setStatus("TXT plan prepared."); }}>Download TXT</button>
        <button type="button" disabled={!selected.length} className={buttonClass} onClick={() => { saveFile(JSON.stringify(plan, null, 2) + "\n", studyActionPlanFilename(plan, "json"), "application/json;charset=utf-8"); setStatus("JSON plan prepared."); }}>Download JSON</button>
        <button type="button" disabled={!selected.length} className={buttonClass} onClick={() => { void copyPlan(); }}>Copy plan</button>
        <button type="button" className={buttonClass} onClick={() => { setExcluded([]); setStatus("All suggested actions selected."); }}>Reset selection</button>
      </div>
      <p aria-live="polite" className="mt-3 text-xs text-slate-600">{status}</p>
    </div>
    <StudyWeeklyScheduleWorkspace plan={plan} history={days} weeklyTarget={weeklyTarget} />
    <p className="text-xs leading-5 text-slate-500">This plan contains only aggregate study metrics and the selected recommendations. It does not include your name, email, or individual study records.</p>
  </section>;
}
