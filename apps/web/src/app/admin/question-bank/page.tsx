import Link from "next/link";
import { AdminShell } from "@/components/app-shell/admin-shell";
import { ThemedExportSelect } from "@/components/shared/themed-export-select";
import { dashboardAction } from "@/components/shared/dashboard-action-styles";
import { StarterQuestionImport } from "@/components/admin/question-workflow";
import { ExpansionQuestionImport } from '@/components/admin/expansion-question-import';
import { listQuestionRevisions } from "@education/database/question-bank";
import { requireQuestionBankAccess } from "@/lib/question-bank-access";
export const metadata = { title: "Question bank", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const access = await requireQuestionBankAccess("/admin/question-bank");
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q.slice(0, 100) : "";
  const status = typeof query.status === "string" ? query.status : "";
  const requested = typeof query.page === "string" ? Number(query.page) : 1;
  const list = await listQuestionRevisions(access.actor.userId, { query: q, status, page: requested });
  function pageHref(page: number) { const params = new URLSearchParams({ q, status, page: String(page) }); return `/admin/question-bank?${params}`; }
  return <AdminShell active="Question bank" userName={access.user.name} userEmail={access.user.email}>
    <div className="space-y-6">
      <header><h1 className="text-3xl font-extrabold">Question bank</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Original, versioned questions with independent review. Published revisions appear in the student question library. Drafts and rejected versions stay out of student sessions.</p></header>
      {access.canAuthor && <div className="flex flex-wrap items-start gap-3"><Link href="/admin/question-bank/new" className={dashboardAction}>Create question</Link><StarterQuestionImport /><ExpansionQuestionImport/></div>}
      <form className="flex flex-wrap items-end gap-3" action="/admin/question-bank">
        <label className="block text-xs font-bold">Search slug<input name="q" defaultValue={q} maxLength={100} className="mt-1 block h-11 rounded-full border border-[#dfe0d5] bg-white px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2" /></label>
        <ThemedExportSelect name="status" label="State" defaultValue={status} options={[{ value: "", label: "All states" }, ...["draft", "in_review", "published", "rejected", "retired"].map(value => ({ value, label: value.replaceAll("_", " ") }))]} />
        <button type="submit" className={dashboardAction}>Apply filters</button>
      </form>
      <p className="text-sm text-slate-600">{list.total} matching revisions · page {list.page}</p>
      <section aria-label="Question revisions" className="grid gap-4 md:grid-cols-2">
        {list.rows.map(({ revision, slug }) => <article key={revision.id} className="rounded-2xl border border-[#dfe0d5] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{revision.content.exam} · {revision.content.topic} · {revision.status.replaceAll("_", " ")} · v{revision.version}</p>
          <h2 className="mt-2 break-words text-lg font-extrabold"><Link href={`/admin/question-bank/${revision.id}`} className="underline decoration-slate-300 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">{slug}</Link></h2>
          <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{revision.content.prompt}</p>
        </article>)}
      </section>
      {!list.rows.length && <p role="status" className="rounded-2xl border border-dashed border-[#dfe0d5] bg-white p-6 text-sm">No revisions match. Authors can create questions or import the original starter drafts.</p>}
      <nav aria-label="Question bank pages" className="flex flex-wrap gap-2">{list.page > 1 && <Link className={dashboardAction} href={pageHref(list.page - 1)}>Previous</Link>}{list.page * 25 < list.total && <Link className={dashboardAction} href={pageHref(list.page + 1)}>Next</Link>}</nav>
    </div>
  </AdminShell>;
}
