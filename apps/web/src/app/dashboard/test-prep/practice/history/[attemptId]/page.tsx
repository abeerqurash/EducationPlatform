import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { getPracticeAttempt } from "@education/database";
import { PracticeAttemptDelete } from "@/components/dashboard/practice-attempt-delete";
import { PRACTICE_QUESTIONS } from "@/app/dashboard/test-prep/practice/question-bank";
export const metadata = { title: "Saved practice review | Student dashboard" };
export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export default async function AttemptDetailPage({ params }: { params: Promise<{attemptId: string}> }) {
  const session = await auth();
  const id = session?.user?.id?.trim();
  if (!id || !UUID.test(id)) redirect("/login?callbackUrl=%2Fdashboard%2Ftest-prep%2Fpractice%2Fhistory");
  const { attemptId } = await params;
  if (!UUID.test(attemptId)) notFound();
  const entry = await getPracticeAttempt(id, attemptId);
  if (!entry) notFound();
  const keys = new Map(PRACTICE_QUESTIONS.map(q => [q.id, q]));
  const selected = new Map(entry.answers.map(a => [a.questionId, a.choice]));
  return <DashboardShell userName={session?.user?.name} userEmail={session?.user?.email} active="Test prep"><main className="mx-auto max-w-5xl space-y-5"><Link href="/dashboard/test-prep/practice/history" className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 text-xs font-bold">← Practice history</Link><header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h1 className="text-2xl font-extrabold">{entry.exam} saved practice review</h1><p className="mt-2 text-sm text-slate-600">{entry.correct}/{entry.total} correct · {entry.percentage}% · {entry.durationSeconds} seconds. Educational practice percentage, not an official scaled score.</p></header><section className="grid gap-3 sm:grid-cols-3">{entry.topicBreakdown.map(row => <div key={row.topic} className="rounded-xl border border-slate-200 bg-white p-4"><h2 className="font-bold">{row.topic}</h2><p className="text-sm">{row.correct}/{row.total} correct · {row.answered} answered</p></div>)}</section><section aria-label="Question review" className="space-y-3">{entry.questionIds.map((qid,i) => {const q=keys.get(qid);const choice=selected.get(qid);return <article key={qid} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-extrabold">Question {i+1} · {q?.topic ?? "Archived question"}</h2><p className="mt-2 text-sm">{q?.prompt ?? `Question ${qid} is no longer in the current question bank.`}</p>{q ? <><p className="mt-3 text-sm">Your answer: {choice === undefined ? "Unanswered" : (q.choices[choice] ?? "Unavailable")}</p><p className="mt-1 text-sm font-semibold">Correct answer: {q.choices[q.correct]}</p><p className="mt-1 text-sm text-slate-600">{q.explanation}</p></> : null}</article>})}</section><PracticeAttemptDelete attemptId={entry.id}/></main></DashboardShell>;
}
