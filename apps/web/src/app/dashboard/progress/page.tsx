import {
  getStudentResultOverview,
  getStudentWorkspace,
  getStudyProgress,
} from "@education/database";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
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

  const [workspace, progress, results] = await Promise.all([
    getStudentWorkspace(userId),
    getStudyProgress(userId),
    getStudentResultOverview(userId),
  ]);

  const completedGoals = workspace.goals.filter((goal) => goal.completedAt).length;
  const target = workspace.profile?.weeklyStudyTargetMinutes ?? 300;
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

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Saved results" value={String(results.savedResultCount)} note="Calculator outcomes in your account" icon="bookmark" />
          <MetricCard label="Tools used" value={String(results.toolsUsed)} note="Distinct saved calculator tools" icon="calculator" />
          <MetricCard label="Goals completed" value={String(completedGoals)} note="Completed active study goals" icon="target" />
          <MetricCard label="Study minutes" value={String(progress.totalMinutes)} note="Recorded during the last 7 days" icon="clock" />
        </section>

        <Panel title="Weekly study target" description={`${progress.totalMinutes} of ${target} minutes recorded`}>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-violet-600" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-xs font-bold text-slate-500">
            <span>{percent}% complete</span>
            <span>{progress.activityCount} activities</span>
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
