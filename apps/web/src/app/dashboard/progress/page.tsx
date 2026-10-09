import {
  getStudentResultOverview,
  getStudentWorkspace,
  getStudyProgress,
  getStudyGoalSummary,
  getStudyMonthlyTrend,
  getStudyProgressExportWindow,
} from "@education/database";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { recordStudySessionAction } from "@/app/actions/student-intelligence";
import { StudyActivityHistory } from "@/components/dashboard/study-activity-history";
import { StudyActivityCalendar } from "@/components/dashboard/study-activity-calendar";
import { AppIcon } from "@/components/app-shell/app-icon";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { parseProgressExportDays } from "./export-window";
import { summarizeStudyDays } from "./insights";
import { ThemedExportSelect } from "@/components/shared/themed-export-select";
import { Eyebrow, MetricCard, Panel } from "@/components/app-shell/dashboard-ui";

export const metadata = { title: "Progress" };

export default async function ProgressPage({ searchParams }: { searchParams: Promise<{ trendDays?: string }> }) {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) {
    redirect("/login?callbackUrl=%2Fdashboard%2Fprogress");
  }

  const trendDays = parseProgressExportDays((await searchParams).trendDays ?? null);
  const [workspace, progress, results, goalSummary, monthly, trend] = await Promise.all([
    getStudentWorkspace(userId),
    getStudyProgress(userId),
    getStudentResultOverview(userId),
    getStudyGoalSummary(userId),
    getStudyMonthlyTrend(userId),
    getStudyProgressExportWindow(userId, trendDays),
  ]);

  const target = workspace.profile?.weeklyStudyTargetMinutes ?? 300;
  const highestMonthlyMinutes = Math.max(1, ...monthly.daily.map((day) => day.minutes));
  const highestTrendMinutes = Math.max(1, ...trend.daily.map((day) => day.minutes));
  const studyInsights = summarizeStudyDays(trend.daily);
  const trendAverage = Math.round(trend.totalMinutes / trendDays);
  const trendCompletion = Math.round((trend.activeDays / trendDays) * 100);
  const trendPeak = trend.daily.reduce((best, day) => day.minutes > best.minutes ? day : best, trend.daily[0]);
  const highestDayMinutes = Math.max(1, ...progress.daily.map((day) => day.minutes));
  const percent = target > 0
    ? Math.min(100, Math.round((progress.totalMinutes / target) * 100))
    : 0;

  return (
    <DashboardShell userName={session.user.name} userEmail={session.user.email} active="Progress">
      <div className="space-y-7">
        <div>
          <Eyebrow><AppIcon name="chart" className="h-3.5 w-3.5" /> Account intelligence</Eyebrow>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">Progress</h1>
          <p className="mt-2 text-sm text-slate-500">Only persisted account activity is reported here.</p>
        </div>

        <section aria-label="Export study progress" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dfe0d5] bg-[#f7f8f2] px-5 py-4">
          <div>
            <p className="text-sm font-extrabold text-[#171912]">Download your study progress</p>
            <p className="mt-1 text-xs text-slate-600">Choose 7, 30 or 90 UTC days. Zero-activity days are included and saved records remain unchanged.</p>
          </div>
          <form method="GET" action="/dashboard/progress/export-csv" className="flex flex-wrap items-end gap-2">
            <ThemedExportSelect name="days" label="Period" defaultValue="30" options={[{ value: "7", label: "Last 7 days" }, { value: "30", label: "Last 30 days" }, { value: "90", label: "Last 90 days" }]} />
            <button type="submit" formAction="/dashboard/progress/export-csv" className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912]">Export CSV</button>
            <button type="submit" formAction="/dashboard/progress/export-text" className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912]">Export TXT</button>
            <button type="submit" formAction="/dashboard/progress/export-json" className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912]">Export JSON</button>
          </form>
        </section>

        <Panel title="Study insights" description="Compare recorded activity across a bounded UTC calendar window. Only your account records are included.">
          <form action="/dashboard/progress" method="GET" className="mb-5 flex flex-wrap items-end gap-3">
            <ThemedExportSelect name="trendDays" label="Chart period" defaultValue={String(trendDays)} options={[{ value: "7", label: "Last 7 days" }, { value: "30", label: "Last 30 days" }, { value: "90", label: "Last 90 days" }]} />
            <button type="submit" className="inline-flex min-h-[44px] items-center rounded-full bg-[#171912] px-5 text-xs font-bold text-white transition hover:bg-[#343a2d]">Update chart</button>
          </form>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Total minutes</p><p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{trend.totalMinutes}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Daily average</p><p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{trendAverage} min</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Active days</p><p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{trend.activeDays} / {trendDays}</p><p className="text-xs text-slate-500">{trendCompletion}% of days</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Busiest day</p><p className="mt-1 text-lg font-extrabold tabular-nums text-slate-900">{trendPeak?.minutes ?? 0} min</p><p className="text-xs text-slate-500">{trendPeak?.minutes ? trendPeak.day : "No recorded activity"}</p></div>
          </div>
          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-100 p-3" role="group" aria-label={`Daily study activity for the last ${trendDays} UTC days`}>
            <div className="flex h-36 min-w-[480px] items-end gap-1" role="list">
              {trend.daily.map((day) => (
                <div key={day.day} role="listitem" aria-label={`${day.day}: ${day.minutes} minutes and ${day.activities} activities`} title={`${day.day}: ${day.minutes} min, ${day.activities} activities`} className="flex h-full min-w-0 flex-1 items-end rounded-t bg-slate-50">
                  <div aria-hidden="true" className="w-full rounded-t bg-violet-600" style={{ height: `${day.minutes ? Math.max(5, (day.minutes / highestTrendMinutes) * 100) : 0}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-semibold tabular-nums text-slate-500"><span>{trend.daily[0]?.day}</span><span>{trend.daily.at(-1)?.day}</span></div>
          </div>
          <p className="mt-3 text-xs text-slate-500">{trend.activityCount} recorded activities. Dates are UTC; empty bars mean no recorded minutes. Daily average includes inactive days.</p>
        </Panel>

        <Panel title="Activity calendar" description={`Explore recorded study activity across the selected ${trendDays}-day UTC reporting window. Color intensity represents recorded minutes.`}>
          <StudyActivityCalendar days={trend.daily} />
        </Panel>

        <Panel title="Study consistency" description="Streaks and weekly summaries use the selected UTC period above. Activity on a day means a recorded session or saved tool activity.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Current streak within selected period</p><p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{studyInsights.currentStreak} days</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Longest streak within selected period</p><p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{studyInsights.longestStreak} days</p></div>
          </div>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[480px] text-left text-xs">
              <caption className="px-4 py-3 text-left text-sm font-extrabold text-slate-900">Weekly activity breakdown (consecutive seven-day groups)</caption>
              <thead className="bg-slate-50 text-slate-600"><tr><th scope="col" className="px-4 py-3">UTC dates</th><th scope="col" className="px-4 py-3">Study minutes</th><th scope="col" className="px-4 py-3">Activities</th><th scope="col" className="px-4 py-3">Active days</th></tr></thead>
              <tbody className="divide-y divide-slate-100">{studyInsights.weeks.map((week) => <tr key={week.label}><th scope="row" className="px-4 py-3 font-semibold text-slate-900">{week.label}</th><td className="px-4 py-3 tabular-nums">{week.minutes}</td><td className="px-4 py-3 tabular-nums">{week.activities}</td><td className="px-4 py-3 tabular-nums">{week.activeDays} / {week.days}</td></tr>)}</tbody>
            </table>
          </div>
          <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-bold text-slate-900">View every day in this period</summary>
            <div className="mt-4 max-h-[420px] overflow-auto rounded-xl border border-slate-100">
              <table className="w-full min-w-[360px] text-left text-xs">
                <caption className="px-3 py-3 text-left font-semibold text-slate-600">All {trendDays} UTC days, including days without activity</caption>
                <thead className="sticky top-0 bg-slate-50 text-slate-700"><tr><th scope="col" className="px-3 py-2">Date (UTC)</th><th scope="col" className="px-3 py-2">Minutes</th><th scope="col" className="px-3 py-2">Activities</th></tr></thead>
                <tbody className="divide-y divide-slate-100">{trend.daily.map((day) => <tr key={day.day}><th scope="row" className="px-3 py-2 font-semibold text-slate-900">{day.day}</th><td className="px-3 py-2 tabular-nums">{day.minutes}</td><td className="px-3 py-2 tabular-nums">{day.activities}</td></tr>)}</tbody>
              </table>
            </div>
          </details>
        </Panel>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Saved results" value={String(results.savedResultCount)} note="Calculator outcomes in your account" icon="bookmark" />
          <MetricCard label="Tools used" value={String(results.toolsUsed)} note="Distinct saved calculator tools" icon="calculator" />
          <MetricCard label="Goals completed" value={String(goalSummary.completedGoals)} note="Completed non-archived study goals" icon="target" />
          <MetricCard label="Study minutes" value={String(progress.totalMinutes)} note="Recorded during the last 7 days" icon="clock" />
        </section>

        <Panel title="Weekly study target" description={`${progress.totalMinutes} of ${target} minutes recorded`}>
          <div role="progressbar" aria-label="Weekly study target progress" aria-valuemin={0} aria-valuemax={Math.max(1, target)} aria-valuenow={Math.min(progress.totalMinutes, Math.max(1, target))} aria-valuetext={`${progress.totalMinutes} of ${target} minutes`} className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-violet-600" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-xs font-bold text-slate-500">
            <span>{percent}% complete</span>
            <span>{progress.activityCount} activities</span>
          </div>
        </Panel>

        <Panel title="Study activity by day" description="Last seven UTC calendar days, including days without activity. Based on recorded sessions and saved tool activity.">
          <div className="grid grid-cols-7 gap-2 sm:gap-4" role="group" aria-label="Daily recorded study minutes">
            {progress.daily.map((day) => (
              <div key={day.day} role="img" aria-label={`${day.day}: ${day.minutes} recorded minutes across ${day.count} activities`} className="flex min-w-0 flex-col items-center gap-2">
                <span aria-hidden="true" className="text-[10px] font-bold tabular-nums text-slate-600">{day.minutes}m</span>
                <div aria-hidden="true" className="flex h-32 w-full items-end rounded-xl bg-slate-100 p-1" title={`${day.day}: ${day.minutes} minutes across ${day.count} activities`}>
                  <div className="w-full rounded-lg bg-violet-600" style={{ height: `${day.minutes > 0 ? Math.max(5, (day.minutes / highestDayMinutes) * 100) : 0}%` }} />
                </div>
                <span aria-hidden="true" className="text-[10px] font-semibold tabular-nums text-slate-500">{day.day.slice(5)}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">Active on {progress.activeDays} of the last 7 UTC days. Bars reflect recorded activity, not an automatically tracked timer.</p>
        </Panel>

        <Panel title="30-day study overview" description="Last 30 UTC calendar days. Only recorded sessions and saved tool activity are counted.">
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Study minutes</p><p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{monthly.totalMinutes}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Active days</p><p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{monthly.activeDays} / 30</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Activities</p><p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{monthly.activityCount}</p></div>
          </div>
          <div role="group" aria-label="Recorded study minutes by UTC date for the last 30 days" className="grid grid-cols-10 gap-1.5 sm:grid-cols-15 sm:gap-2">
            {monthly.daily.map((day) => (
              <div key={day.day} role="img" aria-label={`${day.day}: ${day.minutes} minutes, ${day.activities} activities`} className="flex min-w-0 flex-col items-center gap-1">
                <div aria-hidden="true" className="flex h-20 w-full items-end rounded-md bg-slate-100 p-0.5" title={`${day.day}: ${day.minutes} minutes`}>
                  <div className="w-full rounded-sm bg-violet-600" style={{ height: `${day.minutes > 0 ? Math.max(5, (day.minutes / highestMonthlyMinutes) * 100) : 0}%` }} />
                </div>
                <span aria-hidden="true" className="text-[8px] tabular-nums text-slate-500">{day.day.slice(8)}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">All dates use UTC. A zero-height bar means no recorded study minutes that day.</p>
        </Panel>

        <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
          <Panel title="Log a study session" description="Record time you have actually completed. Sessions contribute to your weekly study total.">
            <form action={recordStudySessionAction} className="space-y-4">
              <label className="block text-xs font-bold text-slate-700">
                What did you study?
                <input name="title" required minLength={2} maxLength={180} placeholder="e.g. SAT reading practice"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              </label>
              <label className="block text-xs font-bold text-slate-700">
                Completed minutes
                <input name="durationMinutes" type="number" required min={1} max={720} step={1}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              </label>
              <button type="submit" className="button button--primary">Record session</button>
            </form>
          </Panel>
          <Panel title="Recent study activity" description="Search and organize your recent seven-day records. Weekly totals include all qualifying records.">
            <StudyActivityHistory activities={progress.activities.map(activity => ({
              id: activity.id,
              title: activity.title,
              activityType: activity.activityType,
              durationMinutes: activity.durationMinutes,
              createdAt: activity.createdAt.toISOString(),
              manual: activity.activityType === "study_session" && (activity.metadata as Record<string, unknown> | null)?.source === "manual_study_log",
            }))} />
          </Panel>
        </div>
      </div>
    </DashboardShell>
  );
}
