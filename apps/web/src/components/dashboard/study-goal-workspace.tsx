"use client";

import { useMemo, useState } from "react";
import { updateStudyGoalAction } from "@/app/actions/student-intelligence";
import { StudyGoalControls } from "@/components/dashboard/study-goal-controls";
import { ThemedFormDate } from "@/components/shared/themed-form-date";
import { ThemedExportSelect } from "@/components/shared/themed-export-select";
import { Panel } from "@/components/app-shell/dashboard-ui";
import { filterAndSortGoals, type GoalWorkspaceFilter } from "./study-goal-filter";
import { paginateGoals } from "./study-goal-pagination";

type Goal = {
  id: string;
  title: string;
  description: string | null;
  targetDate: string | null;
  targetMinutes: number | null;
  completedAt: Date | string | null;
};

const statusOptions = [
  { value: "all", label: "All goals" },
  { value: "open", label: "Open" },
  { value: "completed", label: "Completed" },
];
const deadlineOptions = [
  { value: "all", label: "Any deadline" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "upcoming", label: "Next 7 days" },
  { value: "unscheduled", label: "No deadline" },
];
const sortOptions = [
  { value: "deadline", label: "Deadline first" },
  { value: "title", label: "Title A–Z" },
  { value: "minutes", label: "Most minutes" },
];

export function StudyGoalWorkspace({ goals, todayUtc }: { goals: Goal[]; todayUtc: string }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [deadline, setDeadline] = useState("all");
  const [sort, setSort] = useState("deadline");
  const [pageSize, setPageSize] = useState("10");
  const [page, setPage] = useState(1);
  const visible = useMemo(() => {
    const filter: GoalWorkspaceFilter = { query, status, deadline, sort };
    return filterAndSortGoals(goals, filter, todayUtc);
  }, [goals, query, status, deadline, sort, todayUtc]);
  const pagination = paginateGoals(visible, page, Number(pageSize));
  const changeFilter = (callback: (value: string) => void) => (value: string) => { callback(value); setPage(1); };
  return (
    <Panel title={`${goals.length} active goals`} description="Find, review and edit your goals. Completed goals remain available until archived.">
      <div className="mb-5 grid gap-3 rounded-2xl border border-[#dfe0d5] bg-[#f7f8f2] p-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="block text-xs font-bold text-[#171912]">Search goals
          <input value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="Title or notes" type="search" className="mt-1 h-[44px] w-full rounded-full border border-[#dfe0d5] bg-white px-4 text-xs text-[#171912] outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#171912]" />
        </label>
        <ThemedExportSelect name="goalWorkspaceStatus" label="Status" defaultValue="all" options={statusOptions} value={status} onValueChange={changeFilter(setStatus)} />
        <ThemedExportSelect name="goalWorkspaceDeadline" label="Deadline" defaultValue="all" options={deadlineOptions} value={deadline} onValueChange={changeFilter(setDeadline)} />
        <ThemedExportSelect name="goalWorkspaceSort" label="Sort" defaultValue="deadline" options={sortOptions} value={sort} onValueChange={changeFilter(setSort)} />
        <ThemedExportSelect name="goalWorkspacePageSize" label="Per page" defaultValue="10" options={[{ value: "10", label: "10 goals" }, { value: "20", label: "20 goals" }, { value: "50", label: "50 goals" }]} value={pageSize} onValueChange={changeFilter(setPageSize)} />
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <p role="status" aria-live="polite">Showing {pagination.start}–{pagination.end} of {visible.length} matching goals ({goals.length} total)</p>
        <button type="button" className="font-bold text-[#171912] underline underline-offset-4" onClick={() => { setQuery(""); setStatus("all"); setDeadline("all"); setSort("deadline"); setPageSize("10"); setPage(1); }}>Clear filters</button>
      </div>
      {visible.length ? <div className="divide-y divide-slate-100">{pagination.items.map(goal => (
        <article key={goal.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <h2 className="break-words text-sm font-extrabold text-slate-950">{goal.title}</h2>
              {goal.description ? <p className="mt-1 break-words text-xs leading-5 text-slate-500">{goal.description}</p> : null}
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {goal.completedAt ? "Completed" : "Open"}{goal.targetDate ? ` · Target ${goal.targetDate}` : ""}{goal.targetMinutes ? ` · ${goal.targetMinutes} min` : ""}
              </p>
            </div>
            <div className="space-y-3">
              <StudyGoalControls goalId={goal.id} completed={Boolean(goal.completedAt)} />
              <details className="rounded-2xl border border-slate-200 p-3">
                <summary className="cursor-pointer text-xs font-bold text-slate-700">Edit goal</summary>
                <form action={updateStudyGoalAction} className="mt-3 space-y-3">
                  <input type="hidden" name="goalId" value={goal.id} />
                  <label className="block text-xs font-bold text-slate-700">Title<input name="title" required minLength={2} maxLength={160} defaultValue={goal.title} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
                  <label className="block text-xs font-bold text-slate-700">Notes<textarea name="description" maxLength={1000} rows={2} defaultValue={goal.description ?? ""} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
                  <ThemedFormDate name="targetDate" label="Target date" defaultValue={goal.targetDate ?? ""} />
                  <label className="block text-xs font-bold text-slate-700">Target minutes<input name="targetMinutes" type="number" min={1} max={100000} defaultValue={goal.targetMinutes ?? ""} className="mt-1 h-[50px] w-full rounded-xl border border-slate-200 px-3 text-sm" /></label>
                  <button type="submit" className="button button--secondary">Save changes</button>
                </form>
              </details>
            </div>
          </div>
        </article>
      ))}</div> : <p role="status" className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">No goals match these filters.</p>}
      {pagination.totalPages > 1 && <nav aria-label="Study goal pages" className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold tabular-nums text-slate-600">Page {pagination.page} of {pagination.totalPages}</p>
        <div className="flex items-center gap-2">
          <button type="button" className="button button--secondary" disabled={pagination.page <= 1} onClick={() => setPage(previous => Math.max(1, previous - 1))}>Previous</button>
          <button type="button" className="button button--secondary" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage(previous => Math.min(pagination.totalPages, previous + 1))}>Next</button>
        </div>
      </nav>}
    </Panel>
  );
}
