import Link from "next/link";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {DashboardShell} from "@/components/app-shell/dashboard-shell";
import {PRACTICE_QUESTIONS} from "@/app/dashboard/test-prep/practice/question-bank";
import {auditQuestionBank} from "@education/database/question-quality";
export const metadata={title:"Practice question quality | Student dashboard"};
export default async function QuestionQualityPage(){
 const session=await auth();if(!session?.user?.id?.trim())redirect("/login?callbackUrl=%2Fdashboard%2Ftest-prep%2Fpractice%2Fquestion-quality");
 const findings=auditQuestionBank(PRACTICE_QUESTIONS);
 const rules=[...new Set(findings.map(f=>f.rule))];
 return <DashboardShell userName={session.user.name} userEmail={session.user.email} active="Test prep">
 <main className="mx-auto max-w-5xl space-y-6">
 <Link href="/dashboard/test-prep/practice" className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 text-xs font-bold">← Practice</Link>
 <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h1 className="text-2xl font-extrabold text-slate-950">Practice question quality</h1><p className="mt-2 text-sm text-slate-600">Automated content consistency checks for the current illustrative SAT/ACT practice bank. Passing checks do not guarantee educational accuracy or official endorsement.</p></header>
 <div className="grid gap-4 sm:grid-cols-3">{[{label:"Questions audited",value:PRACTICE_QUESTIONS.length},{label:"Automated findings",value:findings.length},{label:"Rule categories flagged",value:rules.length}].map(x=><article key={x.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xs font-semibold text-slate-600">{x.label}</h2><p className="mt-2 text-2xl font-extrabold text-slate-950">{x.value}</p></article>)}</div>
 <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-extrabold">Content checks</h2>{findings.length?<ul className="mt-3 space-y-2">{findings.map((f,i)=><li key={`${f.rule}-${f.questionId}-${i}`} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950"><strong>{f.questionId} · {f.rule}</strong><p>{f.message}</p></li>)}</ul>:<p className="mt-3 text-sm text-slate-600">No issues found by the automated rules. Manual subject-matter review is still recommended.</p>}</section>
 </main></DashboardShell>;
}
