import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { ThemedFilterPill } from "@/components/shared/themed-filter-pill";
import { dashboardAction } from "@/components/shared/dashboard-action-styles";
import { PracticeReadinessDownloads } from "@/components/dashboard/practice-readiness-downloads";
import { listPracticeAttempts } from "@education/database";
import { buildReadinessReport, readinessExam } from "@education/database/practice-readiness/report";

export const metadata = { title: "Practice readiness | Student dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const path = "/dashboard/test-prep/practice/readiness";

export default async function PracticeReadinessPage({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  const id = session?.user?.id?.trim();
  if (!id || !uuid.test(id)) redirect(`/login?callbackUrl=${encodeURIComponent(path)}`);
  const exam = readinessExam((await searchParams).exam);
  // Keep one across-exam history window when switching filters.
  const rows = await listPracticeAttempts(id, { limit: 100 });
  const report = buildReadinessReport(rows, exam);
  return <DashboardShell userName={session?.user?.name} userEmail={session?.user?.email} active="Test prep">
    <main className="mx-auto max-w-6xl space-y-6">
      <nav aria-label="Practice navigation" className="flex flex-wrap gap-2">
        <Link href="/dashboard/test-prep/practice" className={dashboardAction}>Back to practice</Link>
        <Link href="/dashboard/test-prep/practice/lab" className={dashboardAction}>Practice lab</Link>
        <Link href="/dashboard/test-prep/practice/history" className={dashboardAction}>Session history</Link>
      </nav>
      <header className="rounded-[28px] border border-[#dfe0d5] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-[#171912]">Practice readiness</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{report.disclaimer}</p>
        <p className="mt-2 text-xs leading-5 text-slate-600">{report.scope} Loaded {report.loadedSessions}; matching {report.matchingSessions}.</p>
        {report.excludedSessions > 0 && <p role="status" className="mt-2 text-sm text-amber-800">Excluded {report.excludedSessions} invalid records from calculations.</p>}
        <nav aria-label="Filter report by exam" className="mt-5 flex flex-wrap gap-2">
          {(["All", "SAT", "ACT"] as const).map(value => <ThemedFilterPill key={value} href={value === "All" ? path : `${path}?exam=${value}`} active={exam === value}>{value === "All" ? "All exams" : value}</ThemedFilterPill>)}
        </nav>
        <div className="mt-5"><PracticeReadinessDownloads report={report} /></div>
      </header>
      <section aria-labelledby="readiness-next-steps" className="rounded-[28px] border border-[#dfe0d5] bg-[#f7f8f2] p-6">
        <h2 id="readiness-next-steps" className="text-lg font-extrabold text-[#171912]">Your next steps</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">{report.recommendations.map(item => <li key={item}>{item}</li>)}</ul>
        {!report.matchingSessions && <Link href="/dashboard/test-prep/practice/lab" className={`${dashboardAction} mt-4`}>Start a practice lab session</Link>}
      </section>
      <section aria-label="Practice readiness metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {report.metrics.map(item => <article key={item.label} className="rounded-2xl border border-[#dfe0d5] bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-600">{item.label}</h2>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-[#171912]">{item.value === null ? "No data" : item.value}{item.value !== null && <span className="ml-2 text-xs font-semibold text-slate-600">{item.unit}</span>}</p>
          <p className="mt-3 text-xs leading-5 text-slate-600">{item.description}</p>
        </article>)}
      </section>
      <section aria-labelledby="readiness-methodology" className="rounded-2xl border border-[#dfe0d5] bg-white p-6 text-sm leading-6 text-slate-600">
        <h2 id="readiness-methodology" className="font-extrabold text-[#171912]">How to read this report</h2>
        <p className="mt-2">Question-weighted score counts every question. Answered-question accuracy excludes skipped questions. Session-average score gives each session equal weight. A perfect score on a small familiar set is evidence about that set only.</p>
        <p className="mt-2">Dates use UTC. First-to-latest changes compare different sessions and are descriptive, not a validated improvement estimate. Durations include pauses and review; they are not official exam pacing benchmarks.</p>
      </section>
    </main>
  </DashboardShell>;
}
