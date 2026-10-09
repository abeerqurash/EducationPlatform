"use client";

import { useState } from "react";
import { activityExportFilename, formatStudyActivityExport, type StudyActivityExportFormat } from "./study-activity-export";
import { ConfirmStudySessionDelete } from "@/components/dashboard/confirm-study-session-delete";
import { ThemedExportSelect } from "@/components/shared/themed-export-select";
import { filterStudyActivities, paginateStudyActivities, type StudyActivityRow } from "./study-activity-filter";

/** Only displays the bounded, owner-scoped records provided by the server page. */
export function StudyActivityHistory({ activities }: { activities: StudyActivityRow[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("newest");
  const [size, setSize] = useState("10");
  const [page, setPage] = useState(1);
  const change = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(1); };
  const filtered = filterStudyActivities(activities, { query, type, sort });
  const pagination = paginateStudyActivities(filtered, page, Number(size));
  function download(format: StudyActivityExportFormat) {
    if (!filtered.length) return;
    const content = formatStudyActivityExport(filtered, format);
    const mime = format === "json" ? "application/json;charset=utf-8" : format === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8";
    const url = URL.createObjectURL(new Blob([content], { type: mime }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = activityExportFilename(format);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    // Defer revocation until the browser has processed the download.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <label className="block text-xs font-bold text-[#171912]">Search activity
        <input type="search" value={query} onChange={event => change(setQuery)(event.target.value)} placeholder="Search study titles" className="mt-1 block h-11 w-full rounded-full border border-[#dfe0d5] bg-white px-4 text-sm text-[#171912] outline-none transition placeholder:text-slate-400 focus:border-[#171912] focus:ring-2 focus:ring-[#171912]/15" />
      </label>
      <ThemedExportSelect name="activityType" label="Activity type" value={type} defaultValue="all" onValueChange={change(setType)} options={[{value:"all",label:"All activity"},{value:"sessions",label:"Study sessions"},{value:"calculators",label:"Calculator activity"}]} />
      <ThemedExportSelect name="activitySort" label="Sort by" value={sort} defaultValue="newest" onValueChange={change(setSort)} options={[{value:"newest",label:"Newest first"},{value:"oldest",label:"Oldest first"},{value:"longest",label:"Longest first"},{value:"title",label:"Title A–Z"}]} />
      <ThemedExportSelect name="activityPageSize" label="Per page" value={size} defaultValue="10" onValueChange={change(setSize)} options={[{value:"5",label:"5 activities"},{value:"10",label:"10 activities"},{value:"20",label:"20 activities"}]} />
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p role="status" aria-live="polite" className="text-xs font-semibold text-slate-600">Showing {pagination.start}–{pagination.end} of {pagination.total} matching activities (from {activities.length} recent records)</p>
      {(query || type !== "all" || sort !== "newest") && <button type="button" onClick={() => {setQuery("");setType("all");setSort("newest");setPage(1);}} className="inline-flex min-h-10 items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912] transition hover:bg-[#f1f2ea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912]">Clear filters</button>}
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dfe0d5] bg-[#f7f8f2] px-4 py-3">
      <div><p className="text-xs font-extrabold text-[#171912]">Export matching activity</p><p className="mt-1 text-xs text-slate-600">Includes all {filtered.length} matching records across pages, in the current sort order.</p></div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Export filtered activity">
        {(["csv", "json", "txt"] as const).map(format => <button key={format} type="button" disabled={!filtered.length} onClick={() => download(format)} className="inline-flex min-h-10 items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold uppercase tracking-wide text-[#171912] transition hover:border-[#171912] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912] disabled:cursor-not-allowed disabled:opacity-40">{format}</button>)}
      </div>
    </div>
    {pagination.items.length ? <ol className="divide-y divide-slate-100">
      {pagination.items.map(activity => <li key={activity.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
        <div className="min-w-0"><p className="break-words text-sm font-bold text-slate-900">{activity.title}</p><p className="mt-1 text-xs text-slate-500">{activity.activityType === "study_session" ? "Study session" : "Calculator activity"} · {new Date(activity.createdAt).toLocaleDateString("en-GB", { timeZone: "UTC" })}</p></div>
        <div className="flex shrink-0 flex-col items-end gap-1"><span className="text-xs font-bold text-slate-600">{activity.durationMinutes} min</span>{activity.manual && <ConfirmStudySessionDelete activityId={activity.id} title={activity.title} />}</div>
      </li>)}
    </ol> : <p role="status" className="rounded-2xl bg-[#f7f8f2] px-4 py-6 text-sm text-slate-600">No activities match these filters. Try another search or activity type.</p>}
    {pagination.totalPages > 1 && <nav aria-label="Study activity pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e3e4d9] pt-4">
      <p className="text-xs font-bold text-slate-600">Page {pagination.page} of {pagination.totalPages}</p>
      <div className="flex items-center gap-2"><button type="button" disabled={pagination.page === 1} onClick={() => setPage(current => Math.max(1,current-1))} className="min-h-10 rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912] hover:bg-[#f1f2ea] disabled:cursor-not-allowed disabled:opacity-40">Previous</button><button type="button" disabled={pagination.page === pagination.totalPages} onClick={() => setPage(current => Math.min(pagination.totalPages,current+1))} className="min-h-10 rounded-full bg-[#171912] px-4 text-xs font-bold text-white hover:bg-[#343a2d] disabled:cursor-not-allowed disabled:opacity-40">Next</button></div>
    </nav>}
  </div>;
}
