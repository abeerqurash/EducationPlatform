import { getStudentResultOverview, getStudyGoalSummary, getStudyProgress } from "@education/database";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppIcon } from "@/components/app-shell/app-icon";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { SiteButton } from "@/components/app-shell/site-button";
import { PanelActionLink } from "@/components/app-shell/panel-action-link";
import { summarizeOverviewActivity } from "./overview-insights";
import { Eyebrow, MetricCard, Panel, QuickTool } from "@/components/app-shell/dashboard-ui";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [resultOverview, goalSummary, progress] = await Promise.all([
    getStudentResultOverview(session.user.id),
    getStudyGoalSummary(session.user.id),
    getStudyProgress(session.user.id),
  ]);
  const insights = summarizeOverviewActivity(progress.daily, new Date().toISOString().slice(0, 10));

  const firstName = session.user.name?.trim().split(/\s+/)[0] || "Student";

  return (
    <DashboardShell userName={session.user.name} userEmail={session.user.email} active="Overview">
      <div className="flex flex-col gap-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <Eyebrow><AppIcon name="sparkles" className="h-3.5 w-3.5" /> Student workspace</Eyebrow>
            <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">Welcome back, {firstName}.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Keep your scores, study goals and academic tools together in one focused workspace.</p>
          </div>
          <SiteButton href="/tools" className="self-start md:self-auto">Open a calculator <AppIcon name="arrow" className="h-4 w-4" /></SiteButton>
        </section>

        <section aria-label="Study overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Saved results" value={String(resultOverview.savedResultCount)} note="Your saved calculations will appear here" icon="bookmark" />
          <MetricCard label="Open study goals" value={String(goalSummary.activeGoals)} note={`${goalSummary.completedGoals} goals completed`} icon="target" />
          <MetricCard label="Study streak" value={`${insights.streak} ${insights.streak === 1 ? "day" : "days"}`} note="Consecutive UTC days with recorded activity" icon="calendar" />
          <MetricCard label="Tools used" value={String(resultOverview.toolsUsed)} note="Explore calculators built for your goals" icon="calculator" />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
          <Panel title="Continue learning" description="Your recent activities and study plan will stay organized here."
            action={<PanelActionLink href="/tools">View all tools <AppIcon name="arrow" className="h-3.5 w-3.5" /></PanelActionLink>}>
            {resultOverview.recentResults.length > 0 ? (
              <div className="mb-5 space-y-2">
                {resultOverview.recentResults.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href="/dashboard/saved"
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 transition hover:border-violet-200 hover:bg-violet-50/50"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-violet-600">
                      <AppIcon name="bookmark" className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-extrabold text-slate-900">
                        {item.toolName}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] text-slate-500">
                        {item.summary}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <QuickTool title="GPA Calculator" description="Calculate and plan your GPA" href="/tools/gpa/gpa-calculator" icon="calculator" />
              <QuickTool title="ACT Score Calculator" description="Estimate your enhanced ACT score" href="/tools/test-prep/act-score-calculator" icon="target" />
              <QuickTool title="Grade Calculator" description="Understand your current grade" href="/tools/grades/grade-calculator" icon="chart" />
              <QuickTool title="Final Grade Calculator" description="Plan the score you need" href="/tools/grades/final-grade-calculator" icon="book" />
            </div>
          </Panel>

          <Panel title="This week" description="Your recorded activity during the last seven UTC days.">
            <div className="rounded-2xl bg-[#f7f7fb] p-5">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-violet-600 shadow-sm"><AppIcon name="clock" className="h-[18px] w-[18px]" /></span><div><p className="text-sm font-bold text-slate-900">Weekly study activity</p><p className="mt-0.5 text-[11px] text-slate-500">Your completed sessions and saved calculator activity.</p></div></div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-violet-600" style={{ width: `${Math.round(insights.activeDays / 7 * 100)}%` }} /></div>
              <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-400"><span>{progress.activityCount} activities · {progress.totalMinutes} min</span><span>{insights.activeDays}/7 active days</span></div>
            </div>
            <SiteButton href="/tools" variant="secondary" className="mt-4 flex">Find a study tool <AppIcon name="arrow" className="h-4 w-4" /></SiteButton>
          </Panel>
        </div>

        <section className="overflow-hidden rounded-[26px] bg-gradient-to-br from-violet-600 via-violet-700 to-slate-950 p-6 text-white sm:p-8">
          <div className="max-w-2xl">
            <Eyebrow><span className="text-violet-200">Your academic workspace</span></Eyebrow>
            <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">One place for calculators, test prep and smarter decisions.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100/80">As your account grows, reports, saved results, recommendations and progress history will connect here automatically.</p>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
