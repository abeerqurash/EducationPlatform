import { getStudentTestPrepOverview, getStudentTestPrepHistory, getStudentWorkspace } from "@education/database";
import Link from "next/link";
import { activeTestPrepDatePreset, getTestPrepDatePreset } from "@education/database";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppIcon } from "@/components/app-shell/app-icon";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { Eyebrow, MetricCard, Panel, QuickTool } from "@/components/app-shell/dashboard-ui";
import { SiteButton } from "@/components/app-shell/site-button";
import { ThemedDateRange } from "@/components/shared/themed-date-range";
import { ThemedFilterPill } from "@/components/shared/themed-filter-pill";
import { dashboardAction } from "@/components/shared/dashboard-action-styles";
import { historyPageWindow, historyResultRange } from "@/components/shared/history-page-window";
import { HighlightSearchMatch } from "@/components/shared/highlight-search-match";
import { CopyResultSummary } from "@/components/shared/copy-result-summary";

export const metadata = { title: "Test prep" };

export default async function TestPrepPage({ searchParams }: {
  searchParams: Promise<{ exam?: string; page?: string; from?: string; to?: string; sort?: string; size?: string; q?: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) {
    redirect("/login?callbackUrl=%2Fdashboard%2Ftest-prep");
  }

  const query = await searchParams;
  const [prep, workspace, history] = await Promise.all([
    getStudentTestPrepOverview(userId),
    getStudentWorkspace(userId),
    getStudentTestPrepHistory(userId, query),
  ]);
  const examGoals = workspace.goals.filter((goal) => /\b(sat|act|psat|exam|test prep)\b/i.test(`${goal.title} ${goal.description ?? ""}`));
  const filterParams = new URLSearchParams({ exam: history.exam, sort: history.sort, size: String(history.pageSize) });
  if (history.q) filterParams.set("q", history.q);
  if (history.from) filterParams.set("from", history.from);
  if (history.to) filterParams.set("to", history.to);
  const historyUrl = (page: number) => `/dashboard/test-prep?${filterParams.toString()}&page=${page}`;
  const activePreset = activeTestPrepDatePreset(history.from, history.to);
  const presetUrl = (preset: "7d" | "30d" | "90d") => `/dashboard/test-prep?${new URLSearchParams({ exam: history.exam, sort: history.sort, size: String(history.pageSize), ...(history.q ? { q: history.q } : {}), ...getTestPrepDatePreset(preset), page: "1" }).toString()}`;
  const visiblePages = historyPageWindow(history.page, history.totalPages);
  const visibleRange = historyResultRange(history.page, history.pageSize, history.total);
  const filtersActive = history.exam !== "all" || history.sort !== "newest" || history.pageSize !== 15 || Boolean(history.from || history.to || history.q);
  // Build each removal link from normalized server-owned values, never raw URL input.
  const withoutFilter = (keys: string[]) => {
    const next = new URLSearchParams(filterParams);
    for (const key of keys) next.delete(key);
    next.set("page", "1");
    return `/dashboard/test-prep?${next.toString()}`;
  };
  const activeFilterChips = [
    ...(history.q ? [{ key: "q", label: `Search: ${history.q}`, href: withoutFilter(["q"]) }] : []),
    ...(history.exam !== "all" ? [{ key: "exam", label: `Exam: ${history.exam.toUpperCase()}`, href: withoutFilter(["exam"]) }] : []),
    ...(history.from || history.to ? [{ key: "dates", label: `Dates: ${history.from ?? "Any"} to ${history.to ?? "Any"} UTC`, href: withoutFilter(["from", "to"]) }] : []),
    ...(history.sort !== "newest" ? [{ key: "sort", label: "Order: oldest first", href: withoutFilter(["sort"]) }] : []),
    ...(history.pageSize !== 15 ? [{ key: "size", label: `Page size: ${history.pageSize}`, href: withoutFilter(["size"]) }] : []),
  ];
  const completedGoals = examGoals.filter((goal) => Boolean(goal.completedAt)).length;

  return (
    <DashboardShell userName={session.user.name} userEmail={session.user.email} active="Test prep">
      <div className="space-y-7">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <Eyebrow><AppIcon name="target" className="h-3.5 w-3.5" /> Preparation workspace</Eyebrow>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">Test prep</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Your saved SAT and ACT calculator results, study goals, and next steps in one place. Scores are not inferred from study time.</p>
          </div>
          <SiteButton href="/tools/test-prep" className="self-start md:self-auto">Explore test-prep tools <AppIcon name="arrow" className="h-4 w-4" /></SiteButton>
        </section>

        <section aria-label="Test preparation summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Saved exam results" value={String(prep.savedCount)} note="Saved SAT and ACT calculator outputs" icon="bookmark" />
          <MetricCard label="SAT results" value={String(prep.satCount)} note="Saved SAT-related calculations" icon="calculator" />
          <MetricCard label="ACT results" value={String(prep.actCount)} note="Saved ACT-related calculations" icon="chart" />
          <MetricCard label="Exam goals completed" value={`${completedGoals}/${examGoals.length}`} note="Among your 20 most recent active study-plan goals" icon="target" />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <Panel title="Prepare for your next exam" description="Use an available calculator or plan a focused study session.">
            <div className="space-y-3">
              <QuickTool title="ACT score calculator" description="Calculate an enhanced ACT score using entered section results" href="/tools/test-prep/act-score-calculator" icon="calculator" />
              <QuickTool title="SAT and other test-prep tools" description="Browse currently published test-prep tools" href="/tools/test-prep" icon="book" />
              <QuickTool title="SAT / ACT practice questions" description="Answer original practice questions, review explanations, and download results" href="/dashboard/test-prep/practice" icon="book" />
              <QuickTool title="SAT / ACT practice planner" description="Create a topic-based practice schedule and export it" href="/dashboard/test-prep/practice-planner" icon="book" />
              <QuickTool title="Study plan" description="Create and update an exam preparation goal" href="/dashboard/study-plan" icon="target" />
              <QuickTool title="Study progress" description="Log completed practice time and review your activity" href="/dashboard/progress" icon="clock" />
            </div>
          </Panel>
          <Panel title="Exam preparation goals" description="Goals identified by SAT, ACT, PSAT, exam or test-prep wording in your latest active study plan.">
            {examGoals.length ? (
              <ul className="divide-y divide-slate-100">
                {examGoals.slice(0, 8).map((goal) => (
                  <li key={goal.id} className="py-3 first:pt-0 last:pb-0">
                    <p className="break-words text-sm font-bold text-slate-900">{goal.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{goal.completedAt ? "Completed" : "In progress"}{goal.targetDate ? ` · Target ${goal.targetDate}` : ""}</p>
                  </li>
                ))}
              </ul>
            ) : <p role="status" className="text-sm text-slate-500">No exam-related goals found in your recent study plan. Add a goal with the exam name to see it here.</p>}
            <Link href="/dashboard/study-plan" className={`${dashboardAction} mt-5`}>Manage study goals</Link>
          </Panel>
        </div>

        <Panel title="Saved exam result history" description="Filter and browse your saved SAT and ACT calculator outputs. Results are shown as recorded, without estimating improvement or predicting admissions outcomes."
          action={<Link href="/dashboard/saved" className={`${dashboardAction} shrink-0`}>All saved results</Link>}>
          <form action="/dashboard/test-prep" method="get" role="search" aria-label="Search saved exam results" className="mb-5 flex flex-wrap items-end gap-3">
            <input type="hidden" name="exam" value={history.exam} />
            <input type="hidden" name="sort" value={history.sort} />
            <input type="hidden" name="size" value={String(history.pageSize)} />
            {history.from ? <input type="hidden" name="from" value={history.from} /> : null}
            {history.to ? <input type="hidden" name="to" value={history.to} /> : null}
            <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
              <label htmlFor="test-prep-history-search" className="text-xs font-bold text-slate-700">Search results</label>
              <input id="test-prep-history-search" type="search" name="q" maxLength={80} defaultValue={history.q}
                placeholder="Calculator name or result summary" autoComplete="off"
                className="h-[50px] w-full rounded-full border border-[#dcded2] bg-white px-4 text-sm text-[#171912] outline-none transition focus:border-[#171912] focus:ring-2 focus:ring-[#171912]/15" />
            </div>
            <button type="submit" className="inline-flex h-[50px] items-center justify-center rounded-full bg-[#171912] px-6 text-xs font-bold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">Search</button>
            {history.q ? <Link href={withoutFilter(["q"])} className="inline-flex h-[50px] items-center rounded-full border border-[#dcded2] px-5 text-xs font-bold text-[#171912] hover:bg-slate-100">Clear search</Link> : null}
          </form>
          <nav aria-label="Filter saved exam results" className="mb-5 flex flex-wrap gap-2">
            {(["all", "sat", "act"] as const).map((exam) => (
              <ThemedFilterPill key={exam} href={`/dashboard/test-prep?${new URLSearchParams({ ...Object.fromEntries(filterParams), exam, page: "1" }).toString()}`} active={history.exam === exam}>
                {exam === "all" ? "All exams" : exam.toUpperCase()}
              </ThemedFilterPill>
            ))}
          </nav>
          <nav aria-label="Quick date ranges" className="mb-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold text-slate-500">Saved within</span>
            {(["7d", "30d", "90d"] as const).map((preset) => (
              <ThemedFilterPill key={preset} href={presetUrl(preset)} active={activePreset === preset}>
                {preset === "7d" ? "7 days" : preset === "30d" ? "30 days" : "90 days"}
              </ThemedFilterPill>
            ))}
          </nav>
          <nav aria-label="Sort saved exam results" className="mb-4 flex flex-wrap items-center gap-2">
             <span className="mr-1 text-xs font-semibold text-slate-500">Order</span>
             {(["newest", "oldest"] as const).map((sort) => (
               <ThemedFilterPill key={sort} href={`/dashboard/test-prep?${new URLSearchParams({ ...Object.fromEntries(filterParams), sort, page: "1" }).toString()}`} active={history.sort === sort}>
                 {sort === "newest" ? "Newest first" : "Oldest first"}
               </ThemedFilterPill>
             ))}
           </nav>
           <ThemedDateRange key={`${history.exam}:${history.sort}:${history.pageSize}:${history.from ?? ""}:${history.to ?? ""}:${history.q}`} exam={history.exam} sort={history.sort} size={history.pageSize} q={history.q} from={history.from ?? ""} to={history.to ?? ""} />
          <nav aria-label="Results per page" className="mb-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold text-slate-500">Results per page</span>
            {([15, 30, 50] as const).map((size) => (
              <ThemedFilterPill key={size} href={`/dashboard/test-prep?${new URLSearchParams({ ...Object.fromEntries(filterParams), size: String(size), page: "1" }).toString()}`} active={history.pageSize === size}>
                {size} results
              </ThemedFilterPill>
            ))}
          </nav>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-500">Exports include up to 1,000 matching records in the selected order.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href={`/dashboard/test-prep/export?${filterParams.toString()}`} className={dashboardAction}>Export filtered CSV</Link>
              <Link href={`/dashboard/test-prep/export-json?${filterParams.toString()}`} className={dashboardAction}>Export filtered JSON</Link>
            </div>
          </div>
          {activeFilterChips.length > 0 ? (
            <section aria-label="Active history filters" className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Active filters</span>
              {activeFilterChips.map((chip) => (
                <Link key={chip.key} href={chip.href} aria-label={`Remove ${chip.label} filter`}
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#dfe0d5] bg-[#f7f8f2] px-3 py-1.5 text-xs font-bold text-[#171912] transition hover:border-[#171912] hover:bg-[#eef0e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912]">
                  <span>{chip.label}</span><span aria-hidden="true" className="text-base leading-none">×</span>
                </Link>
              ))}
            </section>
          ) : null}
          {filtersActive ? <Link href="/dashboard/test-prep" className="mb-4 inline-flex rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">Reset all filters</Link> : null}
          <p role="status" aria-live="polite" className="mb-3 text-xs text-slate-500">
            {history.total === 0 ? "No matching saved results" : `Showing ${visibleRange.start}–${visibleRange.end} of ${history.total} saved results`}
            {history.q ? <> for <span className="font-bold text-slate-800">“{history.q}”</span></> : null}
            {` · Page ${history.page} of ${history.totalPages}`}
          </p>
          {history.rows.length ? (
            <ol className="divide-y divide-slate-100">
              {history.rows.map((result) => (
                <li key={result.id} className="flex flex-col justify-between gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-slate-900"><HighlightSearchMatch text={result.toolName} query={history.q} /></p>
                    <p className="mt-1 break-words text-xs text-slate-600"><HighlightSearchMatch text={result.summary} query={history.q} /></p>
                    <p className="mt-1 text-[11px] text-slate-400">{result.createdAt.toLocaleDateString("en-GB", { timeZone: "UTC" })} UTC{result.calculatorVersion ? ` · Calculator ${result.calculatorVersion}` : ""}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700">{/(^|-)sat(-|$)/.test(result.toolSlug) ? "SAT" : "ACT"}</span>
                    <CopyResultSummary summary={result.summary} details={{ toolName: result.toolName, savedDateUtc: result.createdAt.toISOString().slice(0, 10), calculatorVersion: result.calculatorVersion }} />
                  </div>
                </li>
              ))}
            </ol>
          ) : <p role="status" className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">{history.q ? <>No saved exam results match <strong>“{history.q}”</strong> with the selected filters. Try another keyword or clear the search.</> : filtersActive ? "No saved exam results match the selected filters. Remove a filter or reset all filters to see more results." : "No saved SAT or ACT results yet. Complete an available test-prep calculator and save its output to populate this history."}</p>}
          {history.totalPages > 1 ? (
            <form action="/dashboard/test-prep" method="get" aria-label="Jump to saved result page" className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
              <input type="hidden" name="exam" value={history.exam} />
              <input type="hidden" name="sort" value={history.sort} />
              <input type="hidden" name="size" value={String(history.pageSize)} />
              {history.q ? <input type="hidden" name="q" value={history.q} /> : null}
              {history.from ? <input type="hidden" name="from" value={history.from} /> : null}
              {history.to ? <input type="hidden" name="to" value={history.to} /> : null}
              <div className="flex min-w-0 flex-col gap-1.5">
                <label htmlFor="history-jump-page" className="text-xs font-bold text-slate-700">Go to page</label>
                <input id="history-jump-page" name="page" type="number" inputMode="numeric" min={1} max={history.totalPages} step={1} required
                  defaultValue={history.page}
                  className="h-[50px] w-28 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition-colors focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15" />
              </div>
              <button type="submit" className="inline-flex h-[50px] items-center justify-center rounded-full bg-[#171912] px-5 text-xs font-bold text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">Go</button>
              <span className="pb-3 text-xs text-slate-500">1–{history.totalPages}</span>
            </form>
          ) : null}
          <nav aria-label="Exam result history pages" className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
            {history.page > 1 ? <Link className={dashboardAction} href={historyUrl(1)}>First page</Link> : null}
            {history.page > 1 ? (
              <Link className={dashboardAction} href={historyUrl(history.page - 1)}>Previous page</Link>
            ) : null}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Choose history page">
              {visiblePages.map((pageNumber) => (
                <Link key={pageNumber} href={historyUrl(pageNumber)} aria-current={history.page === pageNumber ? "page" : undefined}
                  aria-label={`Page ${pageNumber}`}
                  className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border px-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${history.page === pageNumber ? "border-[#171912] bg-[#171912] text-white" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"}`}>
                  {pageNumber}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
            {history.page < history.totalPages ? (
              <Link className={dashboardAction} href={historyUrl(history.page + 1)}>Next page</Link>
            ) : null}
            {history.page < history.totalPages ? <Link className={dashboardAction} href={historyUrl(history.totalPages)}>Last page</Link> : null}
            </div>
          </nav>
        </Panel>
      </div>
    </DashboardShell>
  );
}
