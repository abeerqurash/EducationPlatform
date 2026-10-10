import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/app-shell/admin-shell";
import { QuestionEditor } from "@/components/admin/question-editor";
import { dashboardAction } from "@/components/shared/dashboard-action-styles";
import { requireQuestionBankAccess } from "@/lib/question-bank-access";
export const metadata = { title: "Create question", robots: { index: false, follow: false } };
export default async function Page() {
  const access = await requireQuestionBankAccess("/admin/question-bank/new");
  if (!access.canAuthor) redirect("/admin/question-bank");
  return <AdminShell active="Question bank" userName={access.user.name} userEmail={access.user.email}><div className="mx-auto max-w-4xl space-y-5"><Link href="/admin/question-bank" className={dashboardAction}>Question bank</Link><h1 className="text-2xl font-extrabold">New question</h1><QuestionEditor /></div></AdminShell>;
}
