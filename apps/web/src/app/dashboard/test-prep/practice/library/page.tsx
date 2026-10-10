import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { QuestionLibrary } from "@/components/dashboard/question-library";
import { dashboardAction } from "@/components/shared/dashboard-action-styles";
import { resumeQuestionPractice } from "@education/database/question-bank";
import { isQuestionId } from "@education/database/question-bank/contract";
export const metadata = { title: "Reviewed question library", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function Page() {
  const session = await auth(); const id = session?.user?.id?.trim();
  if (!isQuestionId(id)) redirect("/login?callbackUrl=%2Fdashboard%2Ftest-prep%2Fpractice%2Flibrary");
  const active = await resumeQuestionPractice(id);
  return <DashboardShell userName={session?.user?.name} userEmail={session?.user?.email} active="Test prep"><main className="mx-auto max-w-5xl space-y-5"><nav className="flex flex-wrap gap-2" aria-label="Practice navigation"><Link href="/dashboard/test-prep/practice" className={dashboardAction}>Practice home</Link><Link href="/dashboard/test-prep/practice/history" className={dashboardAction}>Saved history</Link><Link href="/dashboard/test-prep/practice/readiness" className={dashboardAction}>Practice reports</Link></nav><QuestionLibrary initial={active}/></main></DashboardShell>;
}
