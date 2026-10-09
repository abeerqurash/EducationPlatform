import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { ExamPracticePlanner } from "@/components/dashboard/exam-practice-planner";
export const metadata = { title: "SAT and ACT practice planner" };
export default async function PracticePlannerPage() {
  const session = await auth();
  if (!session?.user?.id?.trim()) redirect("/login?callbackUrl=%2Fdashboard%2Ftest-prep%2Fpractice-planner");
  return <DashboardShell userName={session.user.name} userEmail={session.user.email} active="Test prep"><div className="mx-auto max-w-5xl space-y-5"><Link href="/dashboard/test-prep" className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 text-xs font-bold text-slate-900 hover:bg-slate-50">← Back to test prep</Link><ExamPracticePlanner /></div></DashboardShell>;
}
