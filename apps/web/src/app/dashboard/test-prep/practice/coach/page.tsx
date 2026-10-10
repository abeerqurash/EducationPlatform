import Link from "next/link";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {DashboardShell} from "@/components/app-shell/dashboard-shell";
import {listPracticeAttempts} from "@education/database";
import {weightedAccuracy, medianAccuracy, accuracyVolatility, recentAccuracy, unansweredCount, incorrectCount, answeredCount, practiceMinutes, sessionsByExam, averageSessionSize, averageSessionDuration, perfectSessions, sessionCount, distinctPracticeDays, improvementPoints} from "@education/database/practice-coach";
export const metadata={title:"Practice coach | Student dashboard"};
export const dynamic="force-dynamic";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export default async function PracticeCoachPage(){
const session=await auth();const id=session?.user?.id?.trim();
if(!id||!uuid.test(id))redirect("/login?callbackUrl=%2Fdashboard%2Ftest-prep%2Fpractice%2Fcoach");
const rows=await listPracticeAttempts(id,{limit:100});
const metrics=[{label:"Weighted Accuracy",value:String(weightedAccuracy(rows))},
{label:"Median Accuracy",value:String(medianAccuracy(rows))},
{label:"Accuracy Volatility",value:String(accuracyVolatility(rows))},
{label:"Recent Accuracy",value:String(recentAccuracy(rows))},
{label:"Unanswered Count",value:String(unansweredCount(rows))},
{label:"Incorrect Count",value:String(incorrectCount(rows))},
{label:"Answered Count",value:String(answeredCount(rows))},
{label:"Practice Minutes",value:String(practiceMinutes(rows))},
{label:"Average Session Size",value:String(averageSessionSize(rows))},
{label:"Average Session Duration",value:String(averageSessionDuration(rows))},
{label:"Perfect Sessions",value:String(perfectSessions(rows))},
{label:"Session Count",value:String(sessionCount(rows))},
{label:"Distinct Practice Days",value:String(distinctPracticeDays(rows))},
{label:"Improvement Points",value:String(improvementPoints(rows))},];
const exams=sessionsByExam(rows);
return <DashboardShell userName={session?.user?.name} userEmail={session?.user?.email} active="Test prep">
<main className="mx-auto max-w-6xl space-y-6">
<Link href="/dashboard/test-prep/practice/insights" className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 text-xs font-bold">← Practice insights</Link>
<header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h1 className="text-2xl font-extrabold">Practice coach</h1><p className="mt-2 text-sm text-slate-600">A detailed view of your 100 most recent saved sessions. Not official SAT or ACT score predictions.</p></header>
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(item=><article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xs font-semibold text-slate-600">{item.label}</h2><p className="mt-2 text-2xl font-extrabold">{item.value}</p></article>)}</div>
<section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-lg font-extrabold">Sessions by exam</h2>{Object.entries(exams).map(([exam,count])=><p key={exam} className="mt-2 text-sm">{exam}: {count} sessions</p>)}{!rows.length?<p className="mt-2 text-sm text-slate-600">No saved practice sessions yet.</p>:null}</section>
</main></DashboardShell>;
}
