import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { PracticeLab } from "@/components/dashboard/practice-lab";
export const metadata = { title: "Practice lab | SAT and ACT" };
export default async function PracticeLabPage() {
  const session = await auth();
  if (!session?.user?.id?.trim()) redirect("/login?callbackUrl=%2Fdashboard%2Ftest-prep%2Fpractice%2Flab");
  return <DashboardShell userName={session?.user?.name} userEmail={session?.user?.email} active="Test prep"><main className="mx-auto max-w-5xl space-y-5"><div className="flex flex-wrap gap-2"><Link href="/dashboard/test-prep/practice" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold">← Existing practice quiz</Link><Link href="/dashboard/test-prep/practice/history" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold">Saved history</Link></div><PracticeLab /></main></DashboardShell>;
}
