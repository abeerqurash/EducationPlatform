import { gradePracticeSession, type PracticeAnswer, type PracticeQuestion } from "./question-bank";

/** Deterministic Fisher-Yates permutation; never mutates the original bank. */
export function shufflePracticeQuestions(questions: readonly PracticeQuestion[], seed: number): PracticeQuestion[] {
  const result = [...questions];
  let state = Number.isFinite(seed) ? Math.floor(seed) >>> 0 : 1;
  for (let index = result.length - 1; index > 0; index--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const other = state % (index + 1);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export function getRetryQuestions(questions: readonly PracticeQuestion[], answers: readonly PracticeAnswer[]): PracticeQuestion[] {
  const score = gradePracticeSession(questions, answers);
  const retryIds = new Set(score.results.filter(item => !item.isCorrect).map(item => item.id));
  return questions.filter(question => retryIds.has(question.id));
}

export function formatRetrySummary(questions: readonly PracticeQuestion[], answers: readonly PracticeAnswer[]): string {
  const retry = getRetryQuestions(questions, answers);
  const topics = [...new Set(retry.map(question => question.topic))];
  return ["PRACTICE RETRY SUMMARY", `Questions to revisit: ${retry.length} of ${questions.length}`, `Topics: ${topics.join(", ") || "None"}`, "Incorrect and unanswered items are included.", "Educational practice only; not an official exam score."].join("\n");
}
