import { getStudentWorkspace } from "@education/database";
import { redirect } from "next/navigation";

import { createStudyGoalAction } from "@/app/actions/student-intelligence";
import { auth } from "@/auth";
import { AppIcon } from "@/components/app-shell/app-icon";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { Eyebrow, Panel } from "@/components/app-shell/dashboard-ui";
import { StudyGoalControls } from "@/components/dashboard/study-goal-controls";

export const metadata = { title: "Study plan" };

export default async function StudyPlanPage() {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) {
    redirect("/login?callbackUrl=%2Fdashboard%2Fstudy-plan");
  }

  const workspace = await getStudentWorkspace(userId);

  return (
    <DashboardShell userName={session.user.name} userEmail={session.user.email} active="Study plan">
      <div className="space-y-7">
        <div>
          <Eyebrow><AppIcon name="book" className="h-3.5 w-3.5" /> Planning</Eyebrow>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">Study plan</h1>
          <p className="mt-2 text-sm text-slate-500">Create real goals and keep them connected to your account.</p>
        </div>

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
                <label className="text-xs font-bold text-slate-700">Target date
                  <input name="targetDate" type="date"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
                </label>
                <label className="text-xs font-bold text-slate-700">Target minutes
                  <input name="targetMinutes" type="number" min="1" max="100000"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
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
                      <StudyGoalControls goalId={goal.id} completed={Boolean(goal.completedAt)} />
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
      </div>
    </DashboardShell>
  );
}
