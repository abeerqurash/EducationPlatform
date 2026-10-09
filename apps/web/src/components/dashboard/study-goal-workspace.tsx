"use client";

import { useMemo, useState } from "react";
import { bulkStudyGoalAction, updateStudyGoalAction } from "@/app/actions/student-intelligence";
import { StudyGoalControls } from "@/components/dashboard/study-goal-controls";
import { ThemedFormDate } from "@/components/shared/themed-form-date";
import { ThemedExportSelect } from "@/components/shared/themed-export-select";
import { Panel } from "@/components/app-shell/dashboard-ui";
import { filterAndSortGoals, type GoalWorkspaceFilter } from "./study-goal-filter";
import { bulkSelectionOnPage, describeBulkSelection, reconcileBulkSelection, selectMatchingGoals, bulkSelectionRemainder, MAX_BULK_GOALS, type GoalBulkOperation } from "./study-goal-bulk";
import { paginateGoals } from "./study-goal-pagination";
import { summarizeWorkspaceGoals } from "./study-goal-workspace-insights";
import { StudyGoalInsightsPanel } from "./study-goal-insights-panel";
import { filteredGoalFilename, formatFilteredGoals, type GoalExportFormat } from "./study-goal-filtered-export";

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
  const [pageJump, setPageJump] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkOperation, setBulkOperation] = useState<GoalBulkOperation>("complete");
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const visible = useMemo(() => {
    const filter: GoalWorkspaceFilter = { query, status, deadline, sort };
    return filterAndSortGoals(goals, filter, todayUtc);
  }, [goals, query, status, deadline, sort, todayUtc]);
  const insights = useMemo(() => summarizeWorkspaceGoals(visible, todayUtc), [visible, todayUtc]);
  const pagination = paginateGoals(visible, page, Number(pageSize));
  const pageIds = pagination.items.map(goal => goal.id);
  const selectedOnPage = bulkSelectionOnPage(selectedIds, pageIds);
  const selectedGoals = visible.filter(goal => selectedIds.includes(goal.id));
  const eligibleIds = visible.map(goal => goal.id);
  const allMatchingSelected = eligibleIds.length > 0 && selectMatchingGoals(eligibleIds).every(id => selectedIds.includes(id));
  const toggleGoal = (id: string, checked: boolean) => setSelectedIds(previous => checked ? previous.includes(id) || previous.length >= MAX_BULK_GOALS ? previous : [...previous, id] : previous.filter(item => item !== id));
  const togglePage = (checked: boolean) => setSelectedIds(previous => checked ? [...previous, ...pageIds.filter(id => !previous.includes(id))].slice(0, MAX_BULK_GOALS) : previous.filter(id => !pageIds.includes(id)));
  const applyBulk = async () => {
    if (!selectedIds.length || bulkBusy) return;
    const safeIds = reconcileBulkSelection(selectedIds, eligibleIds);
    if (!safeIds.length) { setSelectedIds([]); return; }
    if (!window.confirm(describeBulkSelection(selectedGoals.map(goal => goal.title), bulkOperation))) return;
    setBulkBusy(true);
    setBulkMessage("");
    try {
      const result = await bulkStudyGoalAction(safeIds, bulkOperation);
      if (!result.ok) { setBulkMessage("Bulk update could not be completed."); return; }
      setBulkMessage(`${result.updated} goal(s) updated. Refreshing the workspace…`);
      setSelectedIds([]);
      window.location.reload();
    } catch { setBulkMessage("Bulk update failed. Please try again."); }
    finally { setBulkBusy(false); }
  };
  const downloadFiltered = (format: GoalExportFormat) => {
    if (!visible.length) return;
    const now = new Date().toISOString();
    const content = formatFilteredGoals(visible, { query, status, deadline, sort }, format, now);
    const mime = format === "json" ? "application/json" : format === "csv" ? "text/csv" : "text/plain";
    const url = URL.createObjectURL(new Blob(["\uFEFF", content], { type: `${mime};charset=utf-8` }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filteredGoalFilename(format, now.slice(0, 10));
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    // Defer revocation until the browser has initiated the download.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const changeFilter = (callback: (value: string) => void) => (value: string) => { callback(value); setPage(1); setSelectedIds([]); setBulkMessage(""); };
  return (
    <Panel title={`${goals.length} active goals`} description="Find, review and edit your goals. Completed goals remain available until archived.">
      <div className="mb-5 grid gap-3 rounded-2xl border border-[#dfe0d5] bg-[#f7f8f2] p-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="block text-xs font-bold text-[#171912]">Search goals
          <input value={query} onChange={event => { setQuery(event.target.value); setPage(1); setSelectedIds([]); setBulkMessage(""); }} placeholder="Title or notes" type="search" className="mt-1 h-[44px] w-full rounded-full border border-[#dfe0d5] bg-white px-4 text-xs text-[#171912] outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#171912]" />
        </label>
        <ThemedExportSelect name="goalWorkspaceStatus" label="Status" defaultValue="all" options={statusOptions} value={status} onValueChange={changeFilter(setStatus)} />
        <ThemedExportSelect name="goalWorkspaceDeadline" label="Deadline" defaultValue="all" options={deadlineOptions} value={deadline} onValueChange={changeFilter(setDeadline)} />
        <ThemedExportSelect name="goalWorkspaceSort" label="Sort" defaultValue="deadline" options={sortOptions} value={sort} onValueChange={changeFilter(setSort)} />
        <ThemedExportSelect name="goalWorkspacePageSize" label="Per page" defaultValue="10" options={[{ value: "10", label: "10 goals" }, { value: "20", label: "20 goals" }, { value: "50", label: "50 goals" }]} value={pageSize} onValueChange={changeFilter(setPageSize)} />
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <p role="status" aria-live="polite">Showing {pagination.start}–{pagination.end} of {visible.length} matching goals ({goals.length} total)</p>
        <button type="button" className="font-bold text-[#171912] underline underline-offset-4" onClick={() => { setQuery(""); setStatus("all"); setDeadline("all"); setSort("deadline"); setPageSize("10"); setPage(1); setSelectedIds([]); setBulkMessage(""); }}>Clear filters</button>
      </div>
      <StudyGoalInsightsPanel insights={insights} onFocus={(nextDeadline, nextStatus) => { setDeadline(nextDeadline); setStatus(nextStatus); setPage(1); setPageJump(""); setSelectedIds([]); setBulkMessage(""); }} />
      <section aria-label="Export filtered study goals" className="mb-5 flex flex-wrap items-center gap-2">
        <p className="mr-2 text-xs font-semibold text-slate-600">Export all {visible.length} matching goals (not just this page):</p>
        {(["csv", "json", "txt"] as const).map(format => <button key={format} type="button" disabled={!visible.length} onClick={() => downloadFiltered(format)} className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold uppercase text-[#171912] transition hover:border-[#171912] disabled:cursor-not-allowed disabled:opacity-40">{format}</button>)}
      </section>
      <section aria-label="Bulk study goal actions" className="mb-5 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <input type="checkbox" checked={selectedOnPage} disabled={bulkBusy || !pageIds.length || (selectedIds.length >= MAX_BULK_GOALS && !selectedOnPage)} onChange={event => togglePage(event.target.checked)} className="h-4 w-4 accent-[#171912]" /> Select current page
        </label>
        <p className="text-xs text-slate-600" role="status" aria-live="polite">{selectedIds.length} selected (maximum {MAX_BULK_GOALS}); {selectedGoals.length} match the current view</p>
        <button type="button" disabled={bulkBusy || !eligibleIds.length || allMatchingSelected} onClick={() => setSelectedIds(selectMatchingGoals(eligibleIds))} className="text-xs font-bold text-[#171912] underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-40">Select matching across all pages ({Math.min(eligibleIds.length, MAX_BULK_GOALS)})</button>
        {bulkSelectionRemainder(eligibleIds.length) > 0 && <p className="w-full text-xs text-amber-800" role="note">Only the first {MAX_BULK_GOALS} matching goals can be selected at once. {bulkSelectionRemainder(eligibleIds.length)} additional matching goals will remain unchanged. Refine filters to manage them.</p>}
        {selectedGoals.length > 0 && <details className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700"><summary className="cursor-pointer font-bold">Review selected goals ({selectedGoals.length})</summary><ul className="mt-2 list-inside list-disc space-y-1">{selectedGoals.slice(0, 10).map(goal => <li key={goal.id} className="break-words">{goal.title}</li>)}</ul>{selectedGoals.length > 10 && <p className="mt-2">And {selectedGoals.length - 10} more selected goals.</p>}</details>}
        <ThemedExportSelect name="goalBulkOperation" label="Bulk action" defaultValue="complete" value={bulkOperation} onValueChange={value => setBulkOperation(value as GoalBulkOperation)} options={[{ value: "complete", label: "Mark completed" }, { value: "reopen", label: "Mark open" }, { value: "archive", label: "Archive selected" }]} />
        <button type="button" disabled={!selectedIds.length || bulkBusy} onClick={applyBulk} className="button button--secondary disabled:cursor-not-allowed disabled:opacity-40">{bulkBusy ? "Updating…" : "Apply to selected"}</button>
        <button type="button" disabled={!selectedIds.length || bulkBusy} onClick={() => setSelectedIds([])} className="text-xs font-bold underline disabled:opacity-40">Clear selection</button>
        {bulkMessage ? <p role="status" className="w-full text-xs text-slate-700">{bulkMessage}</p> : null}
      </section>
      {visible.length ? <div className="divide-y divide-slate-100">{pagination.items.map(goal => (
        <article key={goal.id} className="py-4 first:pt-0 last:pb-0">
          <label className="mb-3 flex w-fit items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" aria-label={`Select goal: ${goal.title}`} checked={selectedIds.includes(goal.id)} disabled={bulkBusy || (selectedIds.length >= MAX_BULK_GOALS && !selectedIds.includes(goal.id))} onChange={event => toggleGoal(goal.id, event.target.checked)} className="h-4 w-4 accent-[#171912]" /> Select goal</label>
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
        <div className="flex flex-wrap items-center gap-2">
          <form className="flex items-center gap-2" onSubmit={event => { event.preventDefault(); const requested = Number(pageJump); if (pageJump.trim() && Number.isSafeInteger(requested) && requested >= 1 && requested <= pagination.totalPages) { setPage(requested); setPageJump(""); } }}>
            <label htmlFor="goal-page-jump" className="text-xs font-semibold text-slate-700">Go to page</label>
            <input id="goal-page-jump" type="number" min={1} max={pagination.totalPages} step={1} required value={pageJump} onChange={event => setPageJump(event.target.value)} className="h-[44px] w-20 rounded-full border border-[#dfe0d5] bg-white px-3 text-xs text-[#171912]" />
            <button type="submit" className="button button--secondary" disabled={!pageJump.trim() || !Number.isSafeInteger(Number(pageJump)) || Number(pageJump) < 1 || Number(pageJump) > pagination.totalPages}>Go</button>
          </form>
          <button type="button" className="button button--secondary" disabled={pagination.page <= 1} onClick={() => setPage(previous => Math.max(1, previous - 1))}>Previous</button>
          <button type="button" className="button button--secondary" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage(previous => Math.min(pagination.totalPages, previous + 1))}>Next</button>
        </div>
      </nav>}
    </Panel>
  );
}
