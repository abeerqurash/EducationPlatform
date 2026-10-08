import { getArchivedStudyGoals, getStudentWorkspace } from "@education/database";
import { redirect } from "next/navigation";

import { createStudyGoalAction, restoreStudyGoalAction, updateStudyGoalAction } from "@/app/actions/student-intelligence";
import { auth } from "@/auth";
import { AppIcon } from "@/components/app-shell/app-icon";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { Eyebrow, Panel } from "@/components/app-shell/dashboard-ui";
import { StudyGoalControls } from "@/components/dashboard/study-goal-controls";
import { ThemedFormDate } from "@/components/shared/themed-form-date";

export const metadata = { title: "Study plan" };

export default async function StudyPlanPage() {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) {
    redirect("/login?callbackUrl=%2Fdashboard%2Fstudy-plan");
  }

  const [workspace, archivedGoals] = await Promise.all([getStudentWorkspace(userId), getArchivedStudyGoals(userId)]);

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
            <p className="mt-1 text-xs text-slate-600">Download up to 1,000 recent active and archived goals. Your existing goals are unchanged.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/dashboard/study-plan/export-csv" className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912] transition hover:border-[#171912] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912]">Export CSV</a>
            <a href="/dashboard/study-plan/export-json" className="inline-flex min-h-[44px] items-center rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912] transition hover:border-[#171912] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912]">Export JSON</a>
          </div>
        </section>

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

          <Panel title={`${workspace.goals.length} active goals`} description="Completed goals stay visible until you archive them.">
            {workspace.goals.length ? (
              <div className="divide-y divide-slate-100">
                {workspace.goals.map((goal) => (
                  <article key={goal.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <h2 className="text-sm font-extrabold text-slate-950">{goal.title}</h2>
                        {goal.description ? <p className="mt-1 text-xs leading-5 text-slate-500">{goal.description}</p> : null}
                        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          {goal.completedAt ? "Completed" : "Active"}
                          {goal.targetDate ? ` · Target ${goal.targetDate}` : ""}
                          {goal.targetMinutes ? ` · ${goal.targetMinutes} min` : ""}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <StudyGoalControls goalId={goal.id} completed={Boolean(goal.completedAt)} />
                        <details className="rounded-2xl border border-slate-200 p-3">
                          <summary className="cursor-pointer text-xs font-bold text-slate-700">Edit goal</summary>
                          <form action={updateStudyGoalAction} className="mt-3 space-y-3">
                            <input type="hidden" name="goalId" value={goal.id} />
                            <label className="block text-xs font-bold text-slate-700">Title
                              <input name="title" required minLength={2} maxLength={160} defaultValue={goal.title} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                            </label>
                            <label className="block text-xs font-bold text-slate-700">Notes
                              <textarea name="description" maxLength={1000} rows={2} defaultValue={goal.description ?? ""} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
                            </label>
                            <ThemedFormDate name="targetDate" label="Target date" defaultValue={goal.targetDate ?? ""} />
                            <label className="block text-xs font-bold text-slate-700">Target minutes
                              <input name="targetMinutes" type="number" min={1} max={100000} defaultValue={goal.targetMinutes ?? ""} className="mt-1 h-[50px] w-full rounded-xl border border-slate-200 px-3 text-sm" />
                            </label>
                            <button type="submit" className="button button--secondary">Save changes</button>
                          </form>
                        </details>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p role="status" className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                No goals yet. Create your first study target.
              </p>
            )}
          </Panel>
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
