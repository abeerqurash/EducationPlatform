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

export const metadata = { title: "Test prep" };

export default async function TestPrepPage({ searchParams }: {
  searchParams: Promise<{ exam?: string; page?: string; from?: string; to?: string }>;
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
  const filterParams = new URLSearchParams({ exam: history.exam });
  if (history.from) filterParams.set("from", history.from);
  if (history.to) filterParams.set("to", history.to);
  const historyUrl = (page: number) => `/dashboard/test-prep?${filterParams.toString()}&page=${page}`;
  const activePreset = activeTestPrepDatePreset(history.from, history.to);
  const presetUrl = (preset: "7d" | "30d" | "90d") => `/dashboard/test-prep?${new URLSearchParams({ exam: history.exam, ...getTestPrepDatePreset(preset), page: "1" }).toString()}`;
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
            <Link href="/dashboard/study-plan" className="mt-5 inline-flex text-xs font-bold text-violet-700 underline underline-offset-4">Manage study goals</Link>
          </Panel>
        </div>

        <Panel title="Saved exam result history" description="Filter and browse your saved SAT and ACT calculator outputs. Results are shown as recorded, without estimating improvement or predicting admissions outcomes."
          action={<Link href="/dashboard/saved" className="shrink-0 text-xs font-bold text-violet-700 hover:underline">All saved results</Link>}>
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
          <ThemedDateRange exam={history.exam} from={history.from ?? ""} to={history.to ?? ""} />
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-500">Exports include up to 1,000 matching records, newest first.</p>
            <Link href={`/dashboard/test-prep/export?${filterParams.toString()}`} className="text-xs font-bold text-violet-700 underline underline-offset-4">Export filtered CSV</Link>
          </div>
          <p className="mb-3 text-xs text-slate-500">{history.total} matching saved results · Page {history.page} of {history.totalPages}</p>
          {history.rows.length ? (
            <ol className="divide-y divide-slate-100">
              {history.rows.map((result) => (
                <li key={result.id} className="flex flex-col justify-between gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-slate-900">{result.toolName}</p>
                    <p className="mt-1 break-words text-xs text-slate-600">{result.summary}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{result.createdAt.toLocaleDateString("en-GB", { timeZone: "UTC" })} UTC{result.calculatorVersion ? ` · Calculator ${result.calculatorVersion}` : ""}</p>
                  </div>
                  <span className="shrink-0 self-start rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold text-violet-700">{/(^|-)sat(-|$)/.test(result.toolSlug) ? "SAT" : "ACT"}</span>
                </li>
              ))}
            </ol>
          ) : <p role="status" className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">No saved results match this exam filter. Complete an available test-prep calculator and save its output to populate this history.</p>}
          <nav aria-label="Exam result history pages" className="mt-5 flex items-center justify-between gap-3">
            {history.page > 1 ? (
              <Link className="text-xs font-bold text-violet-700 underline underline-offset-4" href={historyUrl(history.page - 1)}>Previous page</Link>
            ) : <span />}
            {history.page < history.totalPages ? (
              <Link className="text-xs font-bold text-violet-700 underline underline-offset-4" href={historyUrl(history.page + 1)}>Next page</Link>
            ) : <span />}
          </nav>
        </Panel>
      </div>
    </DashboardShell>
  );
}
