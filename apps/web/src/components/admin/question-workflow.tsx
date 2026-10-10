"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { importStarterQuestionsAction, transitionQuestionAction } from "@/app/actions/question-bank";
import { dashboardAction, dashboardActionPrimary } from "@/components/shared/dashboard-action-styles";
export function StarterQuestionImport() {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  async function run() {
    setBusy(true); try { const result = await importStarterQuestionsAction(); setMessage(result.ok ? `${result.imported} drafts imported; ${result.skipped} existing slugs skipped. Each draft still needs review.` : result.error); if (result.ok) router.refresh(); }
    catch { setMessage("Unable to import drafts. Try again."); } finally { setBusy(false); }
  }
  return <div className="space-y-2"><button type="button" className={dashboardAction} disabled={busy} onClick={run}>{busy ? "Importing…" : "Import 24 starter drafts"}</button>{message && <p role="status" className="text-sm text-slate-700">{message}</p>}</div>;
}
export function QuestionWorkflow({ id, status, isAuthor, canAuthor, canReview }: { id: string; status: string; isAuthor: boolean; canAuthor: boolean; canReview: boolean }) {
  const router = useRouter(); const [note, setNote] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  async function run(action: "submit" | "publish" | "reject" | "retire") {
    setBusy(true); setMessage("");
    try { const result = await transitionQuestionAction(id, action, note); setMessage(result.ok ? "Editorial transition saved." : result.error); if (result.ok) router.refresh(); }
    catch { setMessage("Unable to save this transition. Try again."); } finally { setBusy(false); }
  }
  return <section className="space-y-4 rounded-2xl border border-[#dfe0d5] bg-white p-6" aria-label="Editorial workflow">
    <h2 className="font-extrabold">Editorial workflow · {status.replaceAll("_", " ")}</h2>
    {status === "draft" && isAuthor && canAuthor && <button type="button" className={dashboardActionPrimary} disabled={busy} onClick={() => run("submit")}>Submit for independent review</button>}
    {status === "in_review" && isAuthor && <p className="text-sm text-slate-600">A different account with the Question Reviewer role must review this draft.</p>}
    {canReview && ((status === "in_review" && !isAuthor) || status === "published") && <>
      <label className="block text-sm font-bold">Editorial note (10-1000 characters)<textarea value={note} onChange={event => setNote(event.target.value)} maxLength={1000} rows={3} disabled={busy} className="mt-2 w-full rounded-xl border border-[#dfe0d5] px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2" /></label>
      {status === "in_review" && <p className="text-sm text-slate-600">Before publishing, check the answer, explanation, exam/topic classification, difficulty and source usage. Publishing replaces any previously published revision of this question.</p>}
      <div className="flex flex-wrap gap-2">{status === "in_review" ? <><button type="button" className={dashboardActionPrimary} disabled={busy || note.trim().length < 10} onClick={() => run("publish")}>Approve and publish</button><button type="button" className={dashboardAction} disabled={busy || note.trim().length < 10} onClick={() => run("reject")}>Reject with feedback</button></> : <button type="button" className={dashboardAction} disabled={busy || note.trim().length < 10} onClick={() => run("retire")}>Retire from future sessions</button>}</div>
    </>}
    {message && <p role="status" className="text-sm text-slate-700">{message}</p>}
  </section>;
}
