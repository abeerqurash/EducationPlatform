"use client";

import { useState } from "react";
import type { PrioritizedGoal } from "@/app/dashboard/study-plan/goal-priority";
import { formatPriorityQueueText, summarizePriorityQueue } from "@/app/dashboard/study-plan/goal-priority";
import { ThemedExportSelect } from "@/components/shared/themed-export-select";

const priorities = ["all", "overdue", "today", "soon", "later", "unscheduled"] as const;
export function StudyGoalPriorityQueue({ goals, todayUtc }: { goals: PrioritizedGoal[]; todayUtc: string }) {
  const [filter, setFilter] = useState<string>("all");
  const [feedback, setFeedback] = useState("");
  const filtered = goals.filter(goal => filter === "all" || goal.priority === filter);
  const stats = summarizePriorityQueue(filtered);
  const report = formatPriorityQueueText(filtered, todayUtc);
  const copy = async () => { try { await navigator.clipboard.writeText(report); setFeedback("Priority report copied."); } catch { setFeedback("Copy unavailable; use the download option."); } };
  const download = () => { const blob = new Blob([report], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "study-goal-priorities.txt"; anchor.click(); URL.revokeObjectURL(url); setFeedback("Priority report prepared."); };
  return <div className="space-y-4">
    <div className="flex flex-wrap items-end justify-between gap-3"><ThemedExportSelect name="goalPriority" label="Priority filter" defaultValue="all" value={filter} onValueChange={value => { if (priorities.some(priority => priority === value)) setFilter(value); setFeedback(""); }} options={[{ value: "all", label: "All open goals" }, { value: "overdue", label: "Overdue" }, { value: "today", label: "Due today" }, { value: "soon", label: "Due within 7 days" }, { value: "later", label: "Later deadlines" }, { value: "unscheduled", label: "No deadline" }]} /><div className="flex flex-wrap gap-2"><button type="button" onClick={copy} className="button button--secondary">Copy priorities</button><button type="button" onClick={download} className="button button--secondary">Download TXT</button></div></div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[{ label: "Showing", value: stats.visible }, { label: "Urgent", value: stats.urgent }, { label: "Planned minutes", value: stats.plannedMinutes }, { label: "No deadline", value: stats.withoutDeadline }].map(metric => <div key={metric.label} className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{metric.label}</p><p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{metric.value}</p></div>)}</div>
    {filtered.length ? <ol className="divide-y divide-slate-100 rounded-2xl border border-slate-200">{filtered.map(goal => <li key={goal.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"><div className="min-w-0"><p className="break-words text-sm font-bold text-slate-900">{goal.title}</p><p className="mt-1 text-xs text-slate-500">{goal.targetDate ?? "No deadline"} · {goal.targetMinutes} planned minutes</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">{goal.priority === "soon" ? "Within 7 days" : goal.priority}</span></li>)}</ol> : <p role="status" className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No matching open goals.</p>}
    <p role="status" aria-live="polite" className="text-xs text-slate-500">{feedback || "Read-only priority suggestions. Your goal records are unchanged."}</p>
  </div>;
}
