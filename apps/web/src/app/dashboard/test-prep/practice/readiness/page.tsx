import Link from "next/link";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {DashboardShell} from "@/components/app-shell/dashboard-shell";
import {listPracticeAttempts} from "@education/database";
import {totalQuestions, totalCorrect, totalAnswered, totalMissed, totalUnanswered, weightedAccuracy, completionPercentage, sessionCount, satSessionCount, actSessionCount, totalSeconds, totalMinutes, averageQuestions, averageSeconds, bestAccuracy, worstAccuracy, latestAccuracy, firstAccuracy, accuracyImprovement, perfectSessionCount, zeroScoreCount, activeDays, averageAccuracy, correctPerMinute, unansweredPerSession, incorrectAnswered, fullyAnsweredSessions, satAccuracy, actAccuracy, sessionSpanDays} from "@education/database/practice-readiness";
export const metadata={title:"Practice readiness | Student dashboard"};
export const dynamic="force-dynamic";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export default async function PracticeReadinessPage(){
 const session=await auth();const id=session?.user?.id?.trim();
 if(!id||!uuid.test(id))redirect("/login?callbackUrl=%2Fdashboard%2Ftest-prep%2Fpractice%2Freadiness");
 const rows=await listPracticeAttempts(id,{limit:100});
 const metrics=[{label:"Total Questions",value:totalQuestions(rows)},
{label:"Total Correct",value:totalCorrect(rows)},
{label:"Total Answered",value:totalAnswered(rows)},
{label:"Total Missed",value:totalMissed(rows)},
{label:"Total Unanswered",value:totalUnanswered(rows)},
{label:"Weighted Accuracy",value:weightedAccuracy(rows)},
{label:"Completion Percentage",value:completionPercentage(rows)},
{label:"Session Count",value:sessionCount(rows)},
{label:"Sat Session Count",value:satSessionCount(rows)},
{label:"Act Session Count",value:actSessionCount(rows)},
{label:"Total Seconds",value:totalSeconds(rows)},
{label:"Total Minutes",value:totalMinutes(rows)},
{label:"Average Questions",value:averageQuestions(rows)},
{label:"Average Seconds",value:averageSeconds(rows)},
{label:"Best Accuracy",value:bestAccuracy(rows)},
{label:"Worst Accuracy",value:worstAccuracy(rows)},
{label:"Latest Accuracy",value:latestAccuracy(rows)},
{label:"First Accuracy",value:firstAccuracy(rows)},
{label:"Accuracy Improvement",value:accuracyImprovement(rows)},
{label:"Perfect Session Count",value:perfectSessionCount(rows)},
{label:"Zero Score Count",value:zeroScoreCount(rows)},
{label:"Active Days",value:activeDays(rows)},
{label:"Average Accuracy",value:averageAccuracy(rows)},
{label:"Correct Per Minute",value:correctPerMinute(rows)},
{label:"Unanswered Per Session",value:unansweredPerSession(rows)},
{label:"Incorrect Answered",value:incorrectAnswered(rows)},
{label:"Fully Answered Sessions",value:fullyAnsweredSessions(rows)},
{label:"Sat Accuracy",value:satAccuracy(rows)},
{label:"Act Accuracy",value:actAccuracy(rows)},
{label:"Session Span Days",value:sessionSpanDays(rows)},];
 return <DashboardShell userName={session?.user?.name} userEmail={session?.user?.email} active="Test prep">
 <main className="mx-auto max-w-6xl space-y-6">
 <nav className="flex flex-wrap gap-2"><Link href="/dashboard/test-prep/practice" className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 text-xs font-bold">← Practice</Link><Link href="/dashboard/test-prep/practice/lab" className="inline-flex min-h-11 items-center rounded-full border border-violet-200 bg-violet-50 px-5 text-xs font-bold text-violet-900">Practice lab</Link></nav>
 <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h1 className="text-2xl font-extrabold text-slate-950">Practice readiness</h1><p className="mt-2 text-sm text-slate-600">Detailed descriptive metrics from up to 100 saved SAT/ACT practice sessions. Not a prediction of an official exam score.</p></header>
 <section aria-label="Practice readiness metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(item=><article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xs font-semibold text-slate-600">{item.label}</h2><p className="mt-2 text-2xl font-extrabold text-slate-950">{item.value}</p></article>)}</section>
 {!rows.length?<p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">Save a practice session to populate these metrics.</p>:null}
 </main></DashboardShell>;
}
