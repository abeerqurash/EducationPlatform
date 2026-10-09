"use client";

import { useState } from "react";
import type { PrioritizedGoal } from "@/app/dashboard/study-plan/goal-priority";
import { forecastGoalWorkload, workloadForecastCsv, workloadForecastText } from "@/app/dashboard/study-plan/goal-workload";
import { ThemedExportSelect } from "@/components/shared/themed-export-select";

export function StudyGoalWorkloadForecast({ goals, todayUtc }: { goals: PrioritizedGoal[]; todayUtc: string }) {
  const [capacity, setCapacity] = useState(300);
  const [status, setStatus] = useState("");
  const forecast = forecastGoalWorkload(goals, todayUtc, capacity);
  const download = (kind: "txt" | "csv") => {
    const data = kind === "txt" ? workloadForecastText(forecast, todayUtc) : workloadForecastCsv(forecast);
    const blob = new Blob([data], { type: kind === "txt" ? "text/plain;charset=utf-8" : "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `study-goal-workload.${kind}`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus(`${kind.toUpperCase()} report prepared.`);
  };
  const copy = async () => { try { await navigator.clipboard.writeText(workloadForecastText(forecast, todayUtc)); setStatus("Workload forecast copied."); } catch { setStatus("Copy unavailable. Download the report instead."); } };
  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <ThemedExportSelect name="weeklyCapacity" label="Weekly study capacity" defaultValue="300" value={String(capacity)} onValueChange={value => { setCapacity(Number(value)); setStatus(""); }} options={[60, 120, 180, 300, 450, 600, 900, 1200].map(minutes => ({ value: String(minutes), label: `${minutes} minutes / week` }))} />
      <div className="flex flex-wrap gap-2"><button type="button" className="button button--secondary" onClick={copy}>Copy forecast</button><button type="button" className="button button--secondary" onClick={() => download("txt")}>Download TXT</button><button type="button" className="button button--secondary" onClick={() => download("csv")}>Download CSV</button></div>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[
      { label: "Open goals", value: forecast.totalGoals },
      { label: "Due within 28 days", value: forecast.buckets.slice(1, 5).reduce((sum, bucket) => sum + bucket.goals, 0) },
      { label: "Overdue minutes", value: forecast.overdueMinutes },
      { label: "Overloaded weeks", value: forecast.overloadedWeeks },
    ].map(item => <div key={item.label} className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{item.label}</p><p className="mt-2 text-xl font-extrabold tabular-nums text-slate-950">{item.value}</p></div>)}</div>
    <div className="space-y-3">{forecast.buckets.map(bucket => {
      const isWeek = bucket.key.startsWith("week-");
      const ratio = isWeek ? Math.min(100, Math.round(bucket.minutes / forecast.capacity * 100)) : Math.min(100, Math.round(bucket.minutes / Math.max(1, forecast.scheduledMinutes, forecast.overdueMinutes, forecast.unscheduledMinutes) * 100));
      return <div key={bucket.key} className="rounded-2xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-slate-900">{bucket.label}</p><p className="text-xs font-semibold tabular-nums text-slate-600">{bucket.goals} goals · {bucket.minutes.toLocaleString("en-US")} min{isWeek ? ` / ${forecast.capacity} min capacity` : ""}</p></div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${bucket.label} workload`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={ratio}><div className={`h-full rounded-full ${isWeek && bucket.minutes > forecast.capacity ? "bg-amber-500" : "bg-violet-600"}`} style={{ width: `${ratio}%` }} /></div>
        {isWeek && bucket.minutes > forecast.capacity && <p className="mt-2 text-xs font-semibold text-amber-800">{bucket.minutes - forecast.capacity} minutes above your selected weekly capacity</p>}
        {bucket.titles.length > 0 && <details className="mt-3"><summary className="cursor-pointer text-xs font-bold text-slate-700">View goals ({bucket.goals})</summary><ul className="mt-2 list-inside list-disc space-y-1 text-xs text-slate-600">{bucket.titles.map((title, i) => <li key={`${i}-${title}`} className="break-words">{title}</li>)}</ul>{bucket.goals > bucket.titles.length && <p className="mt-1 text-xs text-slate-500">Showing the first {bucket.titles.length} titles.</p>}</details>}
      </div>;
    })}</div>
    <p className="text-xs text-slate-500">Goal target minutes are grouped by deadline, not allocated across days. The capacity comparison is planning guidance only and does not represent completed activity.</p>
    <p role="status" aria-live="polite" className="text-xs text-slate-600">{status}</p>
  </div>;
}
