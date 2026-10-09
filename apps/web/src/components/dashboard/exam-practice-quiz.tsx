"use client";
import { useEffect, useRef, useState } from "react";
import { gradePracticeSession, practiceReport, selectPracticeQuestions, type PracticeExam, type PracticeTopic } from "@/app/dashboard/test-prep/practice/question-bank";
import { formatCountdown, formatPracticeTopicReport, summarizePracticeTopics } from "@/app/dashboard/test-prep/practice/practice-analytics";
import { ThemedExportSelect } from "@/components/shared/themed-export-select";
const button = "inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 hover:border-violet-400 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600";
function download(name: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function ExamPracticeQuiz() {
  const [exam, setExam] = useState<PracticeExam>("SAT");
  const [topic, setTopic] = useState<PracticeTopic | "All">("All");
  const [limit, setLimit] = useState(10);
  const [duration, setDuration] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState("");
  const startRef = useRef<number | null>(null);
  const questions = selectPracticeQuestions(exam, topic, limit);
  const responses = questions.flatMap(q => Number.isInteger(answers[q.id]) ? [{ id: q.id, choice: answers[q.id] }] : []);
  const score = gradePracticeSession(questions, responses);
  const topics = summarizePracticeTopics(questions, responses);
  const question = questions[current];
  useEffect(() => {
    if (!started || submitted) return;
    const tick = () => {
      const now = Date.now();
      if (startRef.current !== null) setElapsedSeconds(Math.max(0, Math.floor((now - startRef.current) / 1000)));
      if (deadline !== null) {
        const seconds = Math.max(0, Math.ceil((deadline - now) / 1000));
        setRemaining(seconds);
        if (seconds === 0) setSubmitted(true);
      }
    };
    tick();
    const interval = window.setInterval(tick, 500);
    return () => window.clearInterval(interval);
  }, [started, submitted, deadline]);
  function restart() { setAnswers({}); setSubmitted(false); setStarted(false); setDeadline(null); setElapsedSeconds(0); setRemaining(0); setCurrent(0); setFeedback(""); startRef.current = null; }
  function start() { const now = Date.now(); startRef.current = now; setStarted(true); setSubmitted(false); setElapsedSeconds(0); setRemaining(duration * 60); setDeadline(duration > 0 ? now + duration * 60000 : null); }
  function finish() { if (startRef.current !== null) setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startRef.current) / 1000))); setSubmitted(true); }
  const report = () => `${practiceReport(exam, questions, responses)}\n\n${formatPracticeTopicReport(questions, responses, elapsedSeconds)}`;
  return <section aria-label="SAT and ACT practice questions" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div><h1 className="text-2xl font-extrabold tracking-tight text-slate-950">Practice questions</h1><p className="mt-2 text-sm leading-6 text-slate-600">Original educational questions, not official SAT or ACT questions. Practice results are not saved to your account.</p></div>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Exam selection">{(["SAT","ACT"] as const).map(e => <button key={e} type="button" disabled={started && !submitted} aria-pressed={exam===e} onClick={() => {setExam(e); setTopic("All"); restart();}} className={`${button} ${exam===e ? "!border-slate-900 !bg-slate-900 !text-white" : ""}`}>{e}</button>)}</div>
    <div className="flex flex-wrap gap-4"><ThemedExportSelect name="practiceTopic" label="Topic" defaultValue="All" value={topic} onValueChange={v => {setTopic(v as PracticeTopic | "All"); restart();}} options={["All","Math","Reading","English",...(exam==="ACT" ? ["Science"] : [])].map(t=>({value:t,label:t==="All" ? "All topics" : t}))}/><ThemedExportSelect name="practiceQuestionCount" label="Question count" defaultValue="10" value={String(limit)} onValueChange={v=>{setLimit(Number(v));restart();}} options={[5,10,15,20,24].map(n=>({value:String(n),label:`Up to ${n} questions`}))}/><ThemedExportSelect name="practiceDuration" label="Session timer" defaultValue="0" value={String(duration)} onValueChange={v=>{setDuration(Number(v));restart();}} options={[0,5,10,15,20,30,45,60].map(n=>({value:String(n),label:n===0 ? "Untimed" : `${n} minutes`}))}/></div>
    {!started ? <div className="rounded-xl border border-violet-200 bg-violet-50 p-4"><p className="text-sm text-violet-950">{questions.length} questions ready. {duration ? `The ${duration}-minute countdown starts when you begin.` : "No time limit."}</p><button type="button" className={`${button} mt-3 !border-slate-900 !bg-slate-900 !text-white`} onClick={start}>Begin practice session</button></div> : <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4" role="status"><span className="text-sm font-semibold text-slate-800">{score.answered}/{questions.length} answered</span><span className="text-sm font-bold tabular-nums text-slate-900">{duration ? `Time left: ${formatCountdown(remaining)}` : `Elapsed: ${formatCountdown(elapsedSeconds)}`}</span></div>
      <nav aria-label="Practice question navigation" className="flex flex-wrap gap-2">{questions.map((q,i)=><button key={q.id} type="button" aria-current={current===i ? "step" : undefined} onClick={()=>setCurrent(i)} className={`${button} !min-h-9 !min-w-9 !px-2 ${current===i ? "!border-violet-600 !bg-violet-100" : ""} ${answers[q.id]!==undefined ? "!border-emerald-400" : ""}`}>{i+1}</button>)}</nav>
      {question ? <fieldset disabled={submitted} className="rounded-xl border border-slate-200 p-4"><legend className="px-1 text-sm font-extrabold text-slate-900">Question {current+1} of {questions.length} · {question.topic}</legend><p className="mb-3 text-sm leading-6 text-slate-800">{question.prompt}</p><div className="grid gap-2" role="radiogroup" aria-label={`Answer for question ${current+1}`}>{question.choices.map((choice,j)=><button key={j} type="button" role="radio" aria-checked={answers[question.id]===j} disabled={submitted} onClick={()=>setAnswers(previous=>({...previous,[question.id]:j}))} className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-violet-600 disabled:cursor-default ${answers[question.id]===j ? "border-violet-500 bg-violet-50 text-violet-950" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"}`}><span aria-hidden="true" className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${answers[question.id]===j ? "border-violet-600 bg-violet-600 text-white" : "border-slate-400"}`}>{answers[question.id]===j ? "✓" : ""}</span><span>{String.fromCharCode(65+j)}. {choice}</span></button>)}</div>{submitted ? <div className={`mt-3 rounded-lg p-3 text-sm ${answers[question.id]===question.correct ? "bg-emerald-50 text-emerald-950" : "bg-amber-50 text-amber-950"}`}><strong>{answers[question.id]===question.correct ? "Correct" : answers[question.id]===undefined ? "Unanswered" : "Review this answer"}</strong><p className="mt-1">Correct answer: {question.choices[question.correct]}. {question.explanation}</p></div> : null}</fieldset> : null}
      <div className="flex flex-wrap gap-2"><button type="button" className={button} disabled={current===0} onClick={()=>setCurrent(i=>Math.max(0,i-1))}>Previous</button><button type="button" className={button} disabled={current>=questions.length-1} onClick={()=>setCurrent(i=>Math.min(questions.length-1,i+1))}>Next</button>{!submitted ? <button type="button" className={`${button} !border-slate-900 !bg-slate-900 !text-white`} onClick={finish}>Submit answers</button> : null}</div>
      {submitted ? <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4" role="status"><h2 className="text-lg font-extrabold text-slate-950">Session results</h2><p className="text-sm">{score.correct}/{score.total} correct ({score.percentage}%) · {score.incorrect} incorrect · {score.unanswered} unanswered · {formatCountdown(elapsedSeconds)} elapsed</p><p className="text-xs text-slate-600">Practice percentage only; not an official scaled score.</p><h3 className="text-sm font-extrabold">Topic breakdown</h3><div className="grid gap-2 sm:grid-cols-2">{topics.map(row=><div key={row.topic} className="rounded-lg border border-slate-200 bg-white p-3"><strong className="text-sm">{row.topic}</strong><p className="text-sm">{row.correct}/{row.total} correct · {row.percentage}%</p><p className="text-xs text-slate-600">{row.incorrect} incorrect · {row.unanswered} unanswered</p></div>)}</div><h3 className="text-sm font-extrabold">Review every answer</h3><div className="space-y-2">{questions.map((q,i)=><button type="button" key={q.id} onClick={()=>setCurrent(i)} className={`${button} !w-full !justify-between !rounded-xl`}><span>Question {i+1} · {q.topic}</span><span>{score.results[i]?.isCorrect ? "Correct" : score.results[i]?.selected===null ? "Unanswered" : "Incorrect"}</span></button>)}</div><div className="flex flex-wrap gap-2"><button type="button" className={button} onClick={()=>download(`${exam.toLowerCase()}-practice-review.txt`,report())}>Download detailed report</button><button type="button" className={button} onClick={async()=>{try{await navigator.clipboard.writeText(report());setFeedback("Report copied.");}catch{setFeedback("Copy unavailable; download the report instead.");}}}>Copy report</button></div></div> : null}
      <button type="button" className={button} onClick={restart}>Start again</button>
    </>}{feedback ? <p role="status" className="text-sm text-slate-600">{feedback}</p> : null}
  </section>;
}
