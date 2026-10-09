import { gradePracticeSession, type PracticeAnswer, type PracticeQuestion, type PracticeTopic } from "./question-bank";

export type TopicPerformance = { topic: PracticeTopic; total: number; correct: number; incorrect: number; unanswered: number; percentage: number };
export function summarizePracticeTopics(questions: readonly PracticeQuestion[], answers: readonly PracticeAnswer[]): TopicPerformance[] {
  const graded = gradePracticeSession(questions, answers);
  const topics: PracticeTopic[] = ["Math", "Reading", "English", "Science"];
  return topics.flatMap(topic => {
    const items = graded.results.filter(item => item.topic === topic);
    if (!items.length) return [];
    const correct = items.filter(item => item.isCorrect).length;
    const unanswered = items.filter(item => item.selected === null).length;
    return [{ topic, total: items.length, correct, incorrect: items.length - correct - unanswered, unanswered, percentage: Math.round(correct * 100 / items.length) }];
  });
}
export function formatPracticeTopicReport(questions: readonly PracticeQuestion[], answers: readonly PracticeAnswer[], elapsedSeconds: number): string {
  const score = gradePracticeSession(questions, answers);
  const elapsed = Number.isFinite(elapsedSeconds) ? Math.max(0, Math.floor(elapsedSeconds)) : 0;
  return ["PRACTICE PERFORMANCE REPORT", `Questions: ${score.total}`, `Correct: ${score.correct}`, `Incorrect: ${score.incorrect}`, `Unanswered: ${score.unanswered}`, `Practice accuracy: ${score.percentage}%`, `Elapsed time: ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`, "", ...summarizePracticeTopics(questions, answers).map(row => `${row.topic}: ${row.correct}/${row.total} (${row.percentage}%), ${row.unanswered} unanswered`), "", "Educational practice only; not an official exam score."].join("\n");
}
export function formatCountdown(seconds: number): string {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}
