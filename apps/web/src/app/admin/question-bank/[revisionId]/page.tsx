import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/app-shell/admin-shell";
import { QuestionEditor } from "@/components/admin/question-editor";
import { QuestionWorkflow } from "@/components/admin/question-workflow";
import { dashboardAction } from "@/components/shared/dashboard-action-styles";
import { requireQuestionBankAccess } from "@/lib/question-bank-access";
import { getQuestionRevision } from "@education/database/question-bank";
export const metadata = { title: "Question revision", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: Promise<{ revisionId: string }> }) {
  const access = await requireQuestionBankAccess("/admin/question-bank");
  const { revisionId } = await params;
  const entry = await getQuestionRevision(access.actor.userId, revisionId);
  if (!entry) notFound();
  const { revision, slug } = entry; const content = revision.content;
  return <AdminShell active="Question bank" userName={access.user.name} userEmail={access.user.email}>
    <div className="mx-auto max-w-4xl space-y-5">
      <Link href="/admin/question-bank" className={dashboardAction}>Question bank</Link>
      <h1 className="break-words text-2xl font-extrabold">{slug} · revision {revision.version}</h1>
      <section className="space-y-4 rounded-[28px] border border-[#dfe0d5] bg-white p-6" aria-label="Question preview">
        <p className="text-xs font-bold text-slate-500">{content.exam} · {content.topic} · {content.difficulty}</p>
        <h2 className="whitespace-pre-wrap text-lg font-bold">{content.prompt}</h2>
        <ol className="list-decimal space-y-2 pl-5">{content.choices.map((choice, index) => <li key={index} className="whitespace-pre-wrap text-sm">{choice}{index === content.correct && <span className="ml-2 font-bold text-emerald-800">(Correct)</span>}</li>)}</ol>
        <p className="whitespace-pre-wrap text-sm leading-6"><strong>Explanation:</strong> {content.explanation}</p>
        <p className="whitespace-pre-wrap text-sm leading-6"><strong>Provenance:</strong> {content.source}</p>
        {revision.reviewNote && <p className="text-sm leading-6"><strong>Review feedback:</strong> {revision.reviewNote}</p>}
      </section>
      <QuestionWorkflow id={revision.id} status={revision.status} isAuthor={revision.authorUserId === access.actor.userId} canAuthor={access.canAuthor} canReview={access.canReview} />
      {access.canAuthor && <QuestionEditor initial={content} entryId={revision.entryId} />}
    </div>
  </AdminShell>;
}
