"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuestionDraftAction } from "@/app/actions/question-bank";
import { Select } from "@/components/ui/select";
import { dashboardActionPrimary } from "@/components/shared/dashboard-action-styles";
import type { QuestionContent } from "@education/database/question-bank/contract";

const inputClass = "mt-2 w-full rounded-xl border border-[#dfe0d5] bg-white px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912]";
const blank: QuestionContent = { exam: "Both", topic: "Math", difficulty: "foundation", prompt: "", choices: ["", "", "", ""], correct: 0, explanation: "", source: "" };
export function QuestionEditor({ initial = blank, entryId }: { initial?: QuestionContent; entryId?: string }) {
  const router = useRouter();
  const [content, setContent] = useState(initial);
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  function field<K extends keyof QuestionContent>(key: K, value: QuestionContent[K]) { setContent(previous => ({ ...previous, [key]: value })); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return; setBusy(true); setError("");
    try {
      const result = await createQuestionDraftAction({ ...(entryId ? { entryId } : { slug }), content });
      if (result.ok) { router.push(`/admin/question-bank/${result.id}`); router.refresh(); }
      else setError(result.error);
    } catch { setError("Unable to create draft. Try again."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="space-y-5 rounded-[28px] border border-[#dfe0d5] bg-white p-6">
    <h2 className="text-lg font-extrabold text-[#171912]">{entryId ? "Create the next revision" : "Create a question draft"}</h2>
    <p className="text-sm leading-6 text-slate-600">Each save creates an immutable draft. Submit it for a different reviewer to publish. Write original content or document your right to use the source.</p>
    <fieldset disabled={busy} className="space-y-5">
      {!entryId && <label className="block text-sm font-bold">Question slug<input required maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={event => setSlug(event.target.value)} className={inputClass} placeholder="linear-equations-001" /></label>}
      <div className="grid gap-4 sm:grid-cols-3">
        <Select name="exam" label="Exam" value={content.exam} options={["Both", "SAT", "ACT"].map(value => ({ value, label: value }))} onChange={value => { field("exam", value as QuestionContent["exam"]); if (value !== "ACT" && content.topic === "Science") field("topic", "Math"); }} disabled={busy}/>
        <Select name="topic" label="Topic" value={content.topic} options={["Math", "Reading", "English", ...(content.exam === "ACT" ? ["Science"] : [])].map(value => ({ value, label: value }))} onChange={value => field("topic", value as QuestionContent["topic"])} disabled={busy}/>
        <Select name="difficulty" label="Difficulty" value={content.difficulty} options={["foundation", "intermediate", "advanced"].map(value => ({ value, label: value }))} onChange={value => field("difficulty", value as QuestionContent["difficulty"])} disabled={busy}/>
      </div>
      <label className="block text-sm font-bold">Prompt<textarea required minLength={10} maxLength={10000} rows={5} value={content.prompt} onChange={event => field("prompt", event.target.value)} className={inputClass}/></label>
      <label className="block text-sm font-bold">Choices, one per line (2-6)<textarea required rows={6} value={content.choices.join("\n")} onChange={event => field("choices", event.target.value.split("\n"))} className={inputClass}/></label>
      <Select name="correct" label="Correct choice" value={String(content.correct)} options={content.choices.slice(0, 6).map((_, index) => ({ value: String(index), label: `Choice ${index + 1}` }))} onChange={value => field("correct", Number(value))} disabled={busy}/>
      <label className="block text-sm font-bold">Explanation<textarea required minLength={20} maxLength={10000} rows={4} value={content.explanation} onChange={event => field("explanation", event.target.value)} className={inputClass}/></label>
      <label className="block text-sm font-bold">Source and usage provenance<textarea required minLength={10} maxLength={2000} rows={3} value={content.source} onChange={event => field("source", event.target.value)} className={inputClass} placeholder="Original question by our editorial team, or source and permitted usage."/></label>
    </fieldset>
    {error && <p role="alert" className="text-sm font-semibold text-rose-700">{error}</p>}
    <button type="submit" className={dashboardActionPrimary} disabled={busy}>{busy ? "Creating draft…" : "Create immutable draft"}</button>
  </form>;
}
