import {
  getStudentResultOverview,
  getStudentWorkspace,
  getStudyProgress,
  getStudyGoalSummary,
  getStudyMonthlyTrend,
} from "@education/database";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { recordStudySessionAction } from "@/app/actions/student-intelligence";
import { ConfirmStudySessionDelete } from "@/components/dashboard/confirm-study-session-delete";
import { AppIcon } from "@/components/app-shell/app-icon";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { Eyebrow, MetricCard, Panel } from "@/components/app-shell/dashboard-ui";

export const metadata = { title: "Progress" };

export default async function ProgressPage() {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) {
    redirect("/login?callbackUrl=%2Fdashboard%2Fprogress");
  }

  const [workspace, progress, results, goalSummary, monthly] = await Promise.all([
    getStudentWorkspace(userId),
    getStudyProgress(userId),
    getStudentResultOverview(userId),
    getStudyGoalSummary(userId),
    getStudyMonthlyTrend(userId),
  ]);

  const target = workspace.profile?.weeklyStudyTargetMinutes ?? 300;
  const highestMonthlyMinutes = Math.max(1, ...monthly.daily.map((day) => day.minutes));
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
            <p className="text-sm font-extrabold text-[#171912]">Download your 30-day progress</p>
            <p className="mt-1 text-xs text-slate-600">Export the 30 UTC calendar days shown below, including zero-activity days. Your records stay unchanged.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/dashboard/progress/export-csv" className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912] transition hover:border-[#171912] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912]">Export CSV</a>
            <a href="/dashboard/progress/export-json" className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912] transition hover:border-[#171912] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912]">Export JSON</a>
          </div>
        </section>

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
          <Panel title="Recent study activity" description="Latest 7-day records; weekly totals include all qualifying records.">
            {progress.activities.length ? (
              <ol className="divide-y divide-slate-100">
                {progress.activities.slice(0, 12).map((activity) => (
                  <li key={activity.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-bold text-slate-900">{activity.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{activity.activityType === "study_session" ? "Study session" : "Calculator activity"} · {activity.createdAt.toLocaleDateString("en-GB", { timeZone: "UTC" })}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-xs font-bold text-slate-600">{activity.durationMinutes} min</span>
                      {activity.activityType === "study_session" &&
                        (activity.metadata as Record<string, unknown> | null)?.source === "manual_study_log" && (
                          <ConfirmStudySessionDelete activityId={activity.id} title={activity.title} />
                        )}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p role="status" className="text-sm text-slate-500">No recorded study activity in the last 7 days.</p>
            )}
          </Panel>
        </div>
      </div>
    </DashboardShell>
  );
}
