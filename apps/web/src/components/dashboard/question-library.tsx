"use client";
import Link from "next/link";
import { useState } from "react";
import { abandonLibraryAction, saveLibraryDraftAction, startLibraryAction, submitLibraryAction } from "@/app/actions/question-library";
import { Select } from "@/components/ui/select";
import { dashboardAction, dashboardActionPrimary } from "@/components/shared/dashboard-action-styles";
import type { StudentQuestion } from "@education/database/question-bank/contract";

export type LibrarySession = { id: string; exam: "SAT" | "ACT"; createdAt: string; expiresAt: string; answers: { questionId: string; choice: number }[]; questions: StudentQuestion[] };
export function QuestionLibrary({ initial }: { initial: LibrarySession | null }) {
  const [session, setSession] = useState(initial);
  const [exam, setExam] = useState<"SAT" | "ACT">("SAT");
  const [topic, setTopic] = useState("All");
  const [answers, setAnswers] = useState<Record<string, number>>(() => Object.fromEntries(initial?.answers.map(row => [row.questionId, row.choice]) ?? []));
  const [position, setPosition] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(initial ? "Your active session and last saved answers have been restored." : "");
  const [saved, setSaved] = useState<{ id: string; percentage: number } | null>(null);
  const [confirmAbandon, setConfirmAbandon] = useState(false);
  const question = session?.questions[position];
  const responses = session?.questions.flatMap(row => answers[row.id] === undefined ? [] : [{ questionId: row.id, choice: answers[row.id] }]) ?? [];
  async function start() {
    setBusy(true); setMessage("");
    try { const result = await startLibraryAction(exam, topic); if (result.ok) { setSession(result.session); setAnswers({}); setPosition(0); setSaved(null); } else setMessage(result.error); }
    catch { setMessage("Unable to start. Try again."); } finally { setBusy(false); }
  }
  async function run(action: "save" | "submit" | "abandon") {
    if (!session || busy) return; setBusy(true); setMessage("");
    try {
      if (action === "submit") {
        const result = await submitLibraryAction(session.id, responses);
        if (result.ok) { setSaved({ id: result.id, percentage: result.percentage }); setMessage("Graded on the server and saved to your private history."); } else setMessage(result.error);
      } else if (action === "save") {
        const result = await saveLibraryDraftAction(session.id, responses); setMessage(result.ok ? "Answers saved. You can return to this session before it expires." : result.error);
      } else {
        const result = await abandonLibraryAction(session.id); if (result.ok) { setSession(null); setAnswers({}); setConfirmAbandon(false); } else setMessage(result.error);
      }
    } catch { setMessage("Unable to complete this request. Try again."); } finally { setBusy(false); }
  }
  return <section className="space-y-5 rounded-[28px] border border-[#dfe0d5] bg-white p-6" aria-label="Published question practice">
    <header><h1 className="text-2xl font-extrabold text-[#171912]">Question library</h1><p className="mt-2 text-sm leading-6 text-slate-600">Practice up to 10 independently reviewed questions. Answer keys stay on the server until submission. Your result is an educational percentage, not an official SAT or ACT score.</p></header>
    {!session ? <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select name="libraryExam" label="Exam" value={exam} options={["SAT", "ACT"].map(value => ({ value, label: value }))} disabled={busy} onChange={value => { setExam(value as "SAT" | "ACT"); setTopic("All"); }} />
        <Select name="libraryTopic" label="Topic" value={topic} options={["All", "Math", "Reading", "English", ...(exam === "ACT" ? ["Science"] : [])].map(value => ({ value, label: value === "All" ? "All topics" : value }))} disabled={busy} onChange={setTopic} />
      </div>
      <p className="text-xs leading-5 text-slate-600">Sessions expire four hours after the server starts them. Select Save answers before leaving to resume your choices on another device. Time includes breaks and is not an official pacing measure.</p>
      <button type="button" className={dashboardActionPrimary} onClick={start} disabled={busy}>{busy ? "Starting…" : "Start reviewed practice"}</button>
    </> : <>
      <p className="rounded-xl bg-[#f7f8f2] p-4 text-sm">{session.exam} · {responses.length}/{session.questions.length} answered · expires {session.expiresAt.slice(0, 16).replace("T", " ")} UTC</p>
      {saved ? <div className="space-y-3"><h2 className="text-xl font-extrabold">Saved result: {saved.percentage}%</h2><Link href={`/dashboard/test-prep/practice/history/${saved.id}`} className={dashboardActionPrimary}>Review answers and explanations</Link><button type="button" className={dashboardAction} onClick={() => { setSession(null); setSaved(null); setAnswers({}); setMessage(""); }}>New session</button></div> : <>
        <nav aria-label="Question navigation" className="flex flex-wrap gap-2">{session.questions.map((row, index) => <button key={row.id} type="button" className={`${dashboardAction} ${index === position ? "!border-[#171912]" : ""}`} aria-current={index === position ? "step" : undefined} aria-label={`Question ${index + 1}${answers[row.id] === undefined ? ", unanswered" : ", answered"}`} onClick={() => setPosition(index)} disabled={busy}>{index + 1}{answers[row.id] !== undefined ? " ✓" : ""}</button>)}</nav>
        {question && <fieldset disabled={busy} className="space-y-3 rounded-2xl border border-[#dfe0d5] p-5">
          <legend className="px-2 text-sm font-bold">Question {position + 1} · {question.topic} · revision {question.version}</legend>
          <p className="whitespace-pre-wrap text-sm leading-6">{question.prompt}</p>
          {question.choices.map((choice, index) => <label key={index} className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${answers[question.id] === index ? "border-[#171912] bg-[#f1f4e7]" : "border-[#dfe0d5] bg-white"}`}>
            <input type="radio" className="sr-only" name={`answer-${question.id}`} checked={answers[question.id] === index} onChange={() => setAnswers(previous => ({ ...previous, [question.id]: index }))}/>
            <span aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${answers[question.id] === index ? "border-[#171912] bg-[#171912]" : "border-slate-400"}`}/><span className="whitespace-pre-wrap">{String.fromCharCode(65 + index)}. {choice}</span>
          </label>)}
          <button type="button" className={dashboardAction} disabled={answers[question.id] === undefined} onClick={() => setAnswers(previous => { const next = { ...previous }; delete next[question.id]; return next; })}>Clear this answer</button>
        </fieldset>}
        <div className="flex flex-wrap gap-2"><button type="button" className={dashboardAction} disabled={busy || position === 0} onClick={() => setPosition(index => index - 1)}>Previous</button><button type="button" className={dashboardAction} disabled={busy || position >= session.questions.length - 1} onClick={() => setPosition(index => index + 1)}>Next</button><button type="button" className={dashboardAction} disabled={busy} onClick={() => run("save")}>Save answers to resume</button><button type="button" className={dashboardActionPrimary} disabled={busy} onClick={() => run("submit")}>{busy ? "Working…" : "Submit and save result"}</button></div>
        <p className="text-xs text-slate-600">Submitting ends the session. Skipped questions count as unanswered. Repeating Submit after a connection issue returns the same saved result.</p>
        {!confirmAbandon ? <button type="button" className={dashboardAction} disabled={busy} onClick={() => setConfirmAbandon(true)}>Abandon session</button> : <div role="group" aria-label="Confirm abandoning this session" className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm">Abandon this session and its draft answers without saving a result?</p><div className="flex gap-2"><button type="button" className={dashboardAction} disabled={busy} onClick={() => setConfirmAbandon(false)}>Keep practicing</button><button type="button" className={dashboardAction} disabled={busy} onClick={() => run("abandon")}>Confirm abandon</button></div></div>}
      </>}
    </>}
    {message && <p role="status" aria-live="polite" className="text-sm leading-6 text-slate-700">{message}</p>}
  </section>;
}
