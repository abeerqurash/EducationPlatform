import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { listPracticeAttempts } from "@education/database";
import { summarizePracticeHistory } from "@education/database/practice-progress";

export const metadata = { title: "Practice history | Student dashboard" };
export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export default async function PracticeHistoryPage() {
  const session = await auth();
  const id = session?.user?.id?.trim();
  if (!id || !UUID.test(id)) redirect("/login?callbackUrl=%2Fdashboard%2Ftest-prep%2Fpractice%2Fhistory");
  const entries = await listPracticeAttempts(id, { limit: 50 });
  const summary = summarizePracticeHistory(entries);
  return <DashboardShell userName={session?.user?.name} userEmail={session?.user?.email} active="Test prep">
    <main className="mx-auto max-w-5xl space-y-6">
      <Link href="/dashboard/test-prep/practice" className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 text-xs font-bold text-slate-900 hover:bg-slate-50">← Back to practice</Link>
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">Your practice history</h1>
        <p className="mt-2 text-sm text-slate-600">Your saved SAT and ACT educational practice sessions. Percentages are not official exam scores.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        {([{ label: "Saved sessions", value: summary.attempts }, { label: "Questions practiced", value: summary.questions }, { label: "Overall accuracy", value: `${summary.accuracy}%` }] as const).map(item => <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold text-slate-600">{item.label}</p><p className="mt-2 text-2xl font-extrabold text-slate-950">{item.value}</p></div>)}
      </div>
      <section aria-label="Saved sessions" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-950">Recent sessions</h2>
        {!entries.length ? <p className="mt-3 text-sm text-slate-600">No saved practice sessions yet. Once saving is connected to the quiz, your results will appear here.</p> : <ul className="mt-4 divide-y divide-slate-100">{entries.map(entry => <li key={entry.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-bold text-slate-950">{entry.exam} practice · {entry.correct}/{entry.total} correct</p><p className="mt-1 text-xs text-slate-600">{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(entry.createdAt)} UTC · {Math.ceil(entry.durationSeconds / 60)} min</p></div><span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-bold text-violet-900">{entry.percentage}%</span></li>)}</ul>}
      </section>
    </main>
  </DashboardShell>;
}
