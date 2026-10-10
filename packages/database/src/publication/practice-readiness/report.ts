import * as metrics from "./index";
import { type Attempt, ordered, pct, valid } from "./shared";

export type ReadinessExam = "All" | "SAT" | "ACT";
export type ReadinessMetric = Readonly<{ label: string; value: number | null; unit: string; description: string }>;
export function readinessExam(value: unknown): ReadinessExam {
  return value === "SAT" || value === "ACT" ? value : "All";
}

/** Descriptive report only. Repeated illustrative items cannot establish exam readiness. */
export function buildReadinessReport(input: readonly Attempt[], exam: ReadinessExam = "All") {
  const accepted = valid(input);
  const rows = ordered(accepted.filter(row => exam === "All" || row.exam === exam));
  const totals = { questions: metrics.totalQuestions(rows), answered: metrics.totalAnswered(rows), correct: metrics.totalCorrect(rows) };
  const metric = (label: string, value: number | null, unit: string, description: string): ReadinessMetric => ({ label, value, unit, description });
  const score = (value: number) => rows.length ? value : null;
  const cards = [
    metric("Total questions", totals.questions, "questions", "Includes unanswered questions."),
    metric("Total correct", totals.correct, "answers", "Correct answers across matching sessions."),
    metric("Total answered", totals.answered, "answers", "Questions with a submitted choice."),
    metric("Total missed", metrics.totalMissed(rows), "questions", "Incorrect plus unanswered questions."),
    metric("Total unanswered", metrics.totalUnanswered(rows), "questions", "Questions with no submitted choice."),
    metric("Question-weighted score", score(metrics.weightedAccuracy(rows)), "%", "Correct / all questions; unanswered count toward the denominator."),
    metric("Completion", score(metrics.completionPercentage(rows)), "%", "Answered / all questions."),
    metric("Sessions", rows.length, "sessions", "Matching valid sessions in the loaded history."),
    metric("SAT sessions", metrics.satSessionCount(rows), "sessions", "Matching SAT sessions."),
    metric("ACT sessions", metrics.actSessionCount(rows), "sessions", "Matching ACT sessions."),
    metric("Total duration", metrics.totalSeconds(rows), "seconds", "Recorded session elapsed time."),
    metric("Total practice", metrics.totalMinutes(rows), "minutes", "Recorded duration converted to minutes."),
    metric("Average session size", score(metrics.averageQuestions(rows)), "questions", "Rounded questions per session."),
    metric("Average duration", score(metrics.averageSeconds(rows)), "seconds", "Rounded duration per session."),
    metric("Best session score", score(metrics.bestAccuracy(rows)), "%", "Highest correct / all questions percentage."),
    metric("Lowest session score", score(metrics.worstAccuracy(rows)), "%", "Lowest correct / all questions percentage."),
    metric("Latest session score", score(metrics.latestAccuracy(rows)), "%", "Most recent session; not a scaled exam score."),
    metric("First session score", score(metrics.firstAccuracy(rows)), "%", "Earliest session in this history window."),
    metric("First-to-latest change", rows.length > 1 ? metrics.accuracyImprovement(rows) : null, "percentage points", "Different topics and session sizes may affect this comparison."),
    metric("Perfect sessions", metrics.perfectSessionCount(rows), "sessions", "All selected questions answered correctly."),
    metric("Zero-score sessions", metrics.zeroScoreCount(rows), "sessions", "No correct answers; may include unanswered questions."),
    metric("Active UTC days", metrics.activeDays(rows), "days", "Distinct UTC dates with a saved session."),
    metric("Session-average score", score(metrics.averageAccuracy(rows)), "%", "Each session has equal weight regardless of question count."),
    metric("Correct answers per minute", metrics.totalSeconds(rows) > 0 ? metrics.correctPerMinute(rows) : null, "answers/min", "Elapsed time includes review and interruptions."),
    metric("Unanswered per session", score(metrics.unansweredPerSession(rows)), "questions", "Average unanswered questions per session."),
    metric("Incorrect answers", metrics.incorrectAnswered(rows), "answers", "Answered questions that were incorrect."),
    metric("Fully answered sessions", metrics.fullyAnsweredSessions(rows), "sessions", "All selected questions received a choice."),
    metric("SAT question score", metrics.satSessionCount(rows) ? metrics.satAccuracy(rows) : null, "%", "Correct / all questions in matching SAT sessions."),
    metric("ACT question score", metrics.actSessionCount(rows) ? metrics.actAccuracy(rows) : null, "%", "Correct / all questions in matching ACT sessions."),
    metric("Session date span", score(metrics.sessionSpanDays(rows)), "days", "UTC calendar span between first and latest session."),
    metric("Answered-question accuracy", totals.answered ? pct(totals.correct, totals.answered) : null, "%", "Correct / answered questions; excludes unanswered questions."),
  ];
  const recommendations: string[] = [];
  if (!rows.length) recommendations.push("Save a practice lab session for this exam to start your report.");
  else {
    if (rows.length < 3) recommendations.push("Collect more sessions before interpreting changes; this history is a small sample.");
    if (totals.answered < totals.questions) recommendations.push("Review unanswered questions, then try a shorter session you can finish.");
    if (totals.correct < totals.answered) recommendations.push("Review explanations for incorrect answers before retrying those topics.");
    if (totals.correct === totals.questions) recommendations.push("Try different questions and topics; repeating familiar items can inflate scores.");
    if (exam === "All" && metrics.satSessionCount(rows) && metrics.actSessionCount(rows)) recommendations.push("Use the SAT or ACT filter to compare sessions within the same exam.");
  }
  return {
    version: 1, exam, loadedSessions: input.length, excludedSessions: input.length - accepted.length,
    matchingSessions: rows.length,
    firstSession: rows[0] ? new Date(rows[0].createdAt).toISOString() : null,
    latestSession: rows.at(-1) ? new Date(rows.at(-1)!.createdAt).toISOString() : null,
    scope: "Most recent 100 saved sessions across exams, then filtered. This is not lifetime history.",
    disclaimer: "Illustrative practice only. These metrics do not predict official SAT/ACT scores or establish exam readiness.",
    metrics: cards, recommendations,
  };
}
export type ReadinessReport = ReturnType<typeof buildReadinessReport>;

/** Exports aggregate metrics only: no account IDs, answers, prompts, or email addresses. */
export function readinessReportText(report: ReadinessReport): string {
  return ["PRACTICE READINESS REPORT", `Exam: ${report.exam}`, report.scope, report.disclaimer,
    `Matching sessions: ${report.matchingSessions}`, `First session (UTC): ${report.firstSession ?? "None"}`,
    `Latest session (UTC): ${report.latestSession ?? "None"}`, "",
    ...report.metrics.map(row => `${row.label}: ${row.value === null ? "No data" : `${row.value} ${row.unit}`} - ${row.description}`),
    "", "NEXT STEPS", ...report.recommendations].join("\n");
}
