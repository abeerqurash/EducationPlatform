import { getArchivedStudyGoals, getStudentWorkspace } from "@education/database";
import { redirect } from "next/navigation";

import { createStudyGoalAction, restoreStudyGoalAction } from "@/app/actions/student-intelligence";
import { auth } from "@/auth";
import { AppIcon } from "@/components/app-shell/app-icon";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { ThemedExportSelect } from "@/components/shared/themed-export-select";
import { Eyebrow, Panel } from "@/components/app-shell/dashboard-ui";
import { StudyGoalWorkspace } from "@/components/dashboard/study-goal-workspace";
import { ThemedFormDate } from "@/components/shared/themed-form-date";
import { summarizeGoalHealth } from "./goal-insights";
import { prioritizeStudyGoals } from "./goal-priority";
import { StudyGoalWorkloadForecast } from "@/components/dashboard/study-goal-workload-forecast";
import { StudyGoalPriorityQueue } from "@/components/dashboard/study-goal-priority-queue";

export const metadata = { title: "Study plan" };

export default async function StudyPlanPage() {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) {
    redirect("/login?callbackUrl=%2Fdashboard%2Fstudy-plan");
  }

  const [workspace, archivedGoals] = await Promise.all([getStudentWorkspace(userId), getArchivedStudyGoals(userId)]);

  const todayUtc = new Date().toISOString().slice(0, 10);
  const goalHealth = summarizeGoalHealth(workspace.goals, todayUtc);
  const priorityQueue = prioritizeStudyGoals(workspace.goals, todayUtc, 50);

  return (
    <DashboardShell userName={session.user.name} userEmail={session.user.email} active="Study plan">
      <div className="space-y-7">
        <div>
          <Eyebrow><AppIcon name="book" className="h-3.5 w-3.5" /> Planning</Eyebrow>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">Study plan</h1>
          <p className="mt-2 text-sm text-slate-500">Create real goals and keep them connected to your account.</p>
        </div>

        <section aria-label="Export study goals" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dfe0d5] bg-[#f7f8f2] px-5 py-4">
          <div>
            <p className="text-sm font-extrabold text-[#171912]">Back up your study goals</p>
            <p className="mt-1 text-xs text-slate-600">Choose a status and download matching goals from your 1,000 most recent records. Your existing goals are unchanged.</p>
          </div>
          <form method="GET" action="/dashboard/study-plan/export-csv" className="flex flex-wrap items-end gap-2">
            <ThemedExportSelect name="status" label="Goal status" defaultValue="all" options={[{ value: "all", label: "All goals" }, { value: "active", label: "Active" }, { value: "completed", label: "Completed" }, { value: "archived", label: "Archived" }]} />
            <button type="submit" formAction="/dashboard/study-plan/export-csv" className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912] transition hover:border-[#171912]">Export CSV</button>
            <button type="submit" formAction="/dashboard/study-plan/export-text" className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912] transition hover:border-[#171912]">Export TXT</button>
            <button type="submit" formAction="/dashboard/study-plan/export-json" className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912] transition hover:border-[#171912]">Export JSON</button>
          </form>
        </section>

        <section aria-label="Download goal health report" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dfe0d5] bg-[#f7f8f2] px-5 py-4">
          <div>
            <p className="text-sm font-extrabold text-[#171912]">Goal health report</p>
            <p className="mt-1 text-xs text-slate-600">Download current goal metrics and the eight nearest deadlines. The report excludes archived goals.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/dashboard/study-plan/health-csv" className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912] transition hover:border-[#171912]">Report CSV</a>
            <a href="/dashboard/study-plan/health-json" className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912] transition hover:border-[#171912]">Report JSON</a>
            <a href="/dashboard/study-plan/health-text" className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912] transition hover:border-[#171912]">Report TXT</a>
          </div>
        </section>

        <Panel title="Goal priority queue" description="Read-only deadline-based prioritization of up to 50 open account goals, with filtering and a portable text report.">
          <StudyGoalPriorityQueue goals={priorityQueue} todayUtc={todayUtc} />
        </Panel>

        <Panel title="Four-week goal workload forecast" description="Review deadline pressure against a configurable weekly study capacity. This is a read-only planning estimate.">
          <StudyGoalWorkloadForecast goals={prioritizeStudyGoals(workspace.goals, todayUtc, 100)} todayUtc={todayUtc} />
        </Panel>

        <Panel title="Goal health overview" description="Live insights from your current, non-archived goals. Deadlines are compared using UTC dates.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {[
              { label: "Open goals", value: goalHealth.open },
              { label: "Completed", value: goalHealth.completed },
              { label: "Completion rate", value: `${goalHealth.completionRate}%` },
              { label: "Overdue", value: goalHealth.overdue },
              { label: "Due today", value: goalHealth.dueToday },
              { label: "Next 7 days", value: goalHealth.upcoming },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
            <p><strong className="text-slate-900">{goalHealth.plannedMinutes.toLocaleString("en-US")} minutes</strong> planned across open goals</p>
            <p><strong className="text-slate-900">{goalHealth.unscheduled}</strong> open goals without a deadline</p>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Goal completion rate" aria-valuemin={0} aria-valuemax={100} aria-valuenow={goalHealth.completionRate}>
            <div className="h-full rounded-full bg-violet-600" style={{ width: `${goalHealth.completionRate}%` }} />
          </div>
          <details className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-bold text-slate-900">View next goal deadlines</summary>
            {goalHealth.deadlines.length ? (
              <ol className="mt-4 divide-y divide-slate-100">
                {goalHealth.deadlines.map((goal) => (
                  <li key={goal.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs">
                    <span className="min-w-0 break-words font-bold text-slate-900">{goal.title}</span>
                    <span className="font-semibold tabular-nums text-slate-600">{goal.targetDate} · {goal.status}</span>
                  </li>
                ))}
              </ol>
            ) : <p className="mt-3 text-xs text-slate-500">No upcoming or overdue scheduled goals.</p>}
          </details>
          <p className="mt-3 text-xs text-slate-500">Completion metrics exclude archived goals. The deadline list shows up to eight open goals, earliest first.</p>
        </Panel>

        <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
          <Panel title="Create a goal" description="Set a clear target for your next study milestone.">
            <form action={createStudyGoalAction} className="space-y-4">
              <label className="block text-xs font-bold text-slate-700">
                Goal title
                <input name="title" required minLength={2} maxLength={160}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              </label>
              <label className="block text-xs font-bold text-slate-700">
                Notes
                <textarea name="description" maxLength={1000} rows={3}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <ThemedFormDate name="targetDate" label="Target date" />
                <label className="text-xs font-bold text-slate-700">Target minutes
                  <input name="targetMinutes" type="number" min="1" max="100000"
                    className="mt-2 h-[50px] w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm" />
                </label>
              </div>
              <button className="button button--primary" type="submit">Create goal</button>
            </form>
          </Panel>

          <StudyGoalWorkspace goals={workspace.goals} todayUtc={todayUtc} />
        </div>
        <Panel title="Archived study goals" description="Restore a goal to your active plan. Showing up to 50 recently archived goals.">
          {archivedGoals.length ? (
            <ul className="divide-y divide-slate-100">
              {archivedGoals.map((goal) => (
                <li key={goal.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-slate-900">{goal.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{goal.completedAt ? "Completed before archiving" : "Not completed"}</p>
                  </div>
                  <form action={restoreStudyGoalAction}>
                    <input type="hidden" name="goalId" value={goal.id} />
                    <button type="submit" className="button button--secondary" aria-label={`Restore goal: ${goal.title}`}>Restore</button>
                  </form>
                </li>
              ))}
            </ul>
          ) : <p role="status" className="text-sm text-slate-500">No archived goals yet.</p>}
        </Panel>
      </div>
    </DashboardShell>
  );
}
