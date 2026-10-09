"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { savePracticeAttemptAction } from "@/app/actions/practice-attempts";
import { selectPracticeQuestions, gradePracticeSession, type PracticeExam, type PracticeTopic } from "@/app/dashboard/test-prep/practice/question-bank";
import { ThemedExportSelect } from "@/components/shared/themed-export-select";

const button = "inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:border-violet-400 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-50";
type Phase = "setup" | "running" | "complete";
export function PracticeLab() {
  const [exam, setExam] = useState<PracticeExam>("SAT");
  const [topic, setTopic] = useState<PracticeTopic | "All">("All");
  const [count, setCount] = useState(10);
  const [minutes, setMinutes] = useState(0);
  const [phase, setPhase] = useState<Phase>("setup");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [position, setPosition] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);
  const startedAt = useRef<string | null>(null);
  const questions = selectPracticeQuestions(exam, topic, count);
  const question = questions[position];
  const responses = questions.flatMap(q => Number.isInteger(answers[q.id]) ? [{ id: q.id, choice: answers[q.id] }] : []);
  const score = gradePracticeSession(questions, responses);
  const reset = () => { setPhase("setup"); setAnswers({}); setPosition(0); setElapsed(0); setSaving(false); setSaveState("idle"); setMessage(""); setSavedId(null); startedAt.current = null; };
  useEffect(() => {
    if (phase !== "running") return;
    const tick = () => {
      const start = startedAt.current;
      if (!start) return;
      const seconds = Math.max(0, Math.floor((Date.now() - Date.parse(start)) / 1000));
      setElapsed(seconds);
      if (minutes > 0 && seconds >= minutes * 60) setPhase("complete");
    };
    tick(); const id = window.setInterval(tick, 500); return () => window.clearInterval(id);
  }, [phase, minutes]);
  const start = () => { startedAt.current = new Date().toISOString(); setPhase("running"); setElapsed(0); };
  const finish = () => { setElapsed(Math.max(0,Math.floor((Date.now() - Date.parse(startedAt.current ?? new Date().toISOString())) / 1000))); setPhase("complete"); };
  const save = async () => {
    if (saving || saveState === "saved" || !startedAt.current) return;
    setSaving(true); setMessage("");
    try {
      const result = await savePracticeAttemptAction({
        exam, questionIds: questions.map(q => q.id),
        answers: responses.map(a => ({ questionId: a.id, choice: a.choice })),
        startedAt: startedAt.current, submittedAt: new Date().toISOString(),
      });
      if (result.ok) { setSaveState("saved"); setSavedId(result.id); setMessage("Practice session saved to your account."); }
      else { setSaveState("error"); setMessage(result.error); }
    } catch { setSaveState("error"); setMessage("Unable to save. Check your connection and try again."); }
    finally { setSaving(false); }
  };
  return <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Saved practice session">
    <header><h1 className="text-2xl font-extrabold text-slate-950">Practice lab</h1><p className="mt-2 text-sm text-slate-600">Original SAT and ACT educational practice questions. Save completed sessions to your private history. Scores are not official exam scores.</p></header>
    {phase === "setup" ? <><div className="flex flex-wrap gap-2" role="group" aria-label="Exam selection">{(["SAT", "ACT"] as const).map(value => <button key={value} className={`${button} ${exam === value ? "!border-slate-900 !bg-slate-900 !text-white" : ""}`} aria-pressed={exam === value} onClick={() => { setExam(value); setTopic("All"); }} type="button">{value}</button>)}</div>
      <div className="flex flex-wrap gap-4"><ThemedExportSelect name="labTopic" label="Topic" defaultValue="All" value={topic} onValueChange={v => setTopic(v as PracticeTopic | "All")} options={["All","Math","Reading","English",...(exam === "ACT" ? ["Science"] : [])].map(value => ({ value, label: value === "All" ? "All topics" : value }))}/>
      <ThemedExportSelect name="labCount" label="Question count" defaultValue="10" value={String(count)} onValueChange={v => setCount(Number(v))} options={[5,10,15,20,24].map(value => ({value:String(value),label:`Up to ${value} questions`}))}/>
      <ThemedExportSelect name="labDuration" label="Session timer" defaultValue="0" value={String(minutes)} onValueChange={v => setMinutes(Number(v))} options={[0,5,10,15,20,30,45,60].map(value => ({value:String(value),label:value === 0 ? "Untimed" : `${value} minutes`}))}/></div>
      <div className="rounded-xl border border-violet-200 bg-violet-50 p-4"><p className="text-sm text-violet-950">{questions.length} questions ready. You can save your result when the session ends.</p><button className={`${button} mt-3 !border-slate-900 !bg-slate-900 !text-white`} type="button" onClick={start}>Begin practice session</button></div></> : <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><span className="text-sm font-semibold">{score.answered}/{questions.length} answered</span><span className="text-sm font-semibold tabular-nums">{minutes ? `${Math.max(0,minutes * 60 - elapsed)}s remaining` : `${elapsed}s elapsed`}</span></div>
      <nav className="flex flex-wrap gap-2" aria-label="Question navigation">{questions.map((q,i) => <button key={q.id} type="button" onClick={() => setPosition(i)} aria-current={i === position ? "step" : undefined} className={`${button} !min-w-10 !px-2 ${i === position ? "!border-violet-600 !bg-violet-100" : ""} ${answers[q.id] !== undefined ? "!border-emerald-400" : ""}`}>{i + 1}</button>)}</nav>
      {question && <fieldset className="rounded-xl border border-slate-200 p-4" disabled={phase === "complete"}><legend className="px-1 text-sm font-extrabold">Question {position + 1} of {questions.length} · {question.topic}</legend><p className="mb-4 text-sm leading-6">{question.prompt}</p><div className="grid gap-2" role="radiogroup" aria-label={`Answer for question ${position + 1}`}>{question.choices.map((choice,i) => <button key={i} type="button" role="radio" aria-checked={answers[question.id] === i} disabled={phase === "complete"} onClick={() => setAnswers(previous => ({...previous,[question.id]:i}))} className={`min-h-11 rounded-xl border p-3 text-left text-sm ${answers[question.id] === i ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:bg-slate-50"}`}>{String.fromCharCode(65+i)}. {choice}</button>)}</div>{phase === "complete" && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">Correct answer: {question.choices[question.correct]}. {question.explanation}</p>}</fieldset>}
      <div className="flex flex-wrap gap-2"><button className={button} type="button" disabled={position === 0} onClick={() => setPosition(v => Math.max(0,v-1))}>Previous</button><button className={button} type="button" disabled={position === questions.length-1} onClick={() => setPosition(v => Math.min(questions.length-1,v+1))}>Next</button>{phase === "running" && <button className={`${button} !border-slate-900 !bg-slate-900 !text-white`} type="button" onClick={finish}>Submit answers</button>}</div>
      {phase === "complete" && <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"><h2 className="text-lg font-extrabold">Session results</h2><p className="text-sm">{score.correct}/{score.total} correct ({score.percentage}%) · {score.incorrect} incorrect · {score.unanswered} unanswered</p><p className="text-xs text-slate-600">Your results are not saved until you select Save session.</p><div className="flex flex-wrap gap-2"><button className={`${button} !border-slate-900 !bg-slate-900 !text-white`} type="button" onClick={save} disabled={saving || saveState === "saved"}>{saving ? "Saving…" : saveState === "saved" ? "Saved" : "Save session"}</button><Link href="/dashboard/test-prep/practice/history" className={button}>Practice history</Link>{savedId && <Link href={`/dashboard/test-prep/practice/history/${savedId}`} className={button}>Review saved attempt</Link>}</div>{message && <p role="status" className={`text-sm ${saveState === "error" ? "text-rose-700" : "text-emerald-700"}`}>{message}</p>}</div>}
      <button type="button" className={button} onClick={reset}>Start again</button></>}
  </section>;
}
