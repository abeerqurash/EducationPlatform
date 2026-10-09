import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { ExamPracticeQuiz } from "@/components/dashboard/exam-practice-quiz";
export const metadata = { title: "SAT and ACT practice questions" };
export default async function PracticePage() {
  const session = await auth();
  if (!session?.user?.id?.trim()) redirect("/login?callbackUrl=%2Fdashboard%2Ftest-prep%2Fpractice");
  return <DashboardShell userName={session?.user?.name} userEmail={session?.user?.email} active="Test prep"><div className="mx-auto max-w-5xl space-y-5"><div className="flex flex-wrap gap-2"><Link href="/dashboard/test-prep" className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 text-xs font-bold text-slate-900 hover:bg-slate-50">← Back to test prep</Link><Link href="/dashboard/test-prep/practice/lab" className="inline-flex min-h-11 items-center rounded-full border border-violet-300 bg-violet-50 px-5 text-xs font-bold text-violet-900 hover:bg-violet-100">Practice lab · Save sessions</Link><Link href="/dashboard/test-prep/practice/history" className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 text-xs font-bold text-slate-900 hover:bg-slate-50">Practice history</Link></div><ExamPracticeQuiz /></div></DashboardShell>;
}
