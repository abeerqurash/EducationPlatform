/**
 * Practice attempt write boundary.
 * Only question IDs and selected option indices are accepted from the browser.
 * Correct answers, scores, and timing are computed on trusted server data.
 */
export type PracticeExamId = "SAT" | "ACT";
export type PracticeAnswerInput = Readonly<{ questionId: string; choice: number }>;
export type PracticeQuestionKey = Readonly<{
  id: string;
  exam: PracticeExamId | "Both";
  topic: string;
  correct: number;
  choiceCount: number;
}>;
export type PracticeAttemptInput = Readonly<{
  exam: PracticeExamId;
  questionIds: readonly string[];
  answers: readonly PracticeAnswerInput[];
  startedAt: string;
  submittedAt: string;
}>;
export type PracticeAttemptResult = Readonly<{
  exam: PracticeExamId;
  total: number;
  answered: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  percentage: number;
  durationSeconds: number;
  questionIds: readonly string[];
  answers: readonly PracticeAnswerInput[];
  topicBreakdown: readonly Readonly<{
    topic: string;
    total: number;
    answered: number;
    correct: number;
  }>[];
}>;

export class InvalidPracticeAttempt extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPracticeAttempt";
  }
}

const fail = (message: string): never => { throw new InvalidPracticeAttempt(message); };
const own = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const validId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
const validDate = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-\d\d-\d\dT/.test(value) &&
  Number.isFinite(Date.parse(value));

/** Pure function: suitable for API validation, repository tests, and server actions. */
export function gradeTrustedPracticeAttempt(
  payload: unknown,
  trustedQuestions: readonly PracticeQuestionKey[],
  options: Readonly<{ maxQuestions?: number; maxDurationSeconds?: number }> = {},
): PracticeAttemptResult {
  if (!own(payload)) fail("Invalid attempt payload");
  const data = payload as Record<string, unknown>;
  if (data.exam !== "SAT" && data.exam !== "ACT") fail("Unsupported exam");
  const exam = data.exam as PracticeExamId;
  const maxQuestions = options.maxQuestions ?? 100;
  const maxDurationSeconds = options.maxDurationSeconds ?? 4 * 60 * 60;
  if (!Number.isSafeInteger(maxQuestions) || maxQuestions < 1) fail("Invalid question limit");
  if (!Number.isSafeInteger(maxDurationSeconds) || maxDurationSeconds < 0) fail("Invalid duration limit");
  if (!Array.isArray(data.questionIds) || data.questionIds.length < 1 ||
      data.questionIds.length > maxQuestions || !data.questionIds.every(validId)) {
    fail("Invalid question selection");
  }
  const questionIds = data.questionIds as string[];
  if (new Set(questionIds).size !== questionIds.length) fail("Duplicate question IDs");
  if (!Array.isArray(data.answers) || data.answers.length > questionIds.length) fail("Invalid answers");
  const trusted = new Map(trustedQuestions.map(question => [question.id, question]));
  if (trusted.size !== trustedQuestions.length) fail("Duplicate trusted question IDs");
  const selectedQuestions = questionIds.map(id => {
    const question = trusted.get(id);
    if (!question || (question.exam !== exam && question.exam !== "Both") ||
        !Number.isSafeInteger(question.correct) || !Number.isSafeInteger(question.choiceCount) ||
        question.choiceCount < 2 || question.choiceCount > 10 ||
        question.correct < 0 || question.correct >= question.choiceCount) {
      return fail("Unknown or invalid question for selected exam");
    }
    return question;
  });
  const allowedIds = new Set(questionIds);
  const answers: PracticeAnswerInput[] = [];
  const seen = new Set<string>();
  for (const raw of data.answers as unknown[]) {
    if (!own(raw) || !validId(raw.questionId) || !allowedIds.has(raw.questionId) ||
        seen.has(raw.questionId)) fail("Unknown or duplicate answer");
    const question = trusted.get(raw.questionId)!;
    if (!Number.isSafeInteger(raw.choice) || (raw.choice as number) < 0 ||
        (raw.choice as number) >= question.choiceCount) fail("Invalid answer choice");
    seen.add(raw.questionId);
    answers.push({ questionId: raw.questionId, choice: raw.choice as number });
  }
  if (!validDate(data.startedAt) || !validDate(data.submittedAt)) fail("Invalid attempt timestamps");
  const start = Date.parse(data.startedAt as string);
  const end = Date.parse(data.submittedAt as string);
  const durationSeconds = Math.floor((end - start) / 1000);
  if (end < start || durationSeconds > maxDurationSeconds) fail("Invalid attempt duration");
  const selected = new Map(answers.map(answer => [answer.questionId, answer.choice]));
  const correct = selectedQuestions.filter(question => selected.get(question.id) === question.correct).length;
  const topicMap = new Map<string, { topic: string; total: number; answered: number; correct: number }>();
  for (const question of selectedQuestions) {
    const row = topicMap.get(question.topic) ?? { topic: question.topic, total: 0, answered: 0, correct: 0 };
    row.total++;
    if (selected.has(question.id)) row.answered++;
    if (selected.get(question.id) === question.correct) row.correct++;
    topicMap.set(question.topic, row);
  }
  return {
    exam, total: selectedQuestions.length, answered: answers.length, correct,
    incorrect: answers.length - correct, unanswered: selectedQuestions.length - answers.length,
    percentage: Math.round(correct * 100 / selectedQuestions.length),
    durationSeconds, questionIds: [...questionIds], answers,
    topicBreakdown: [...topicMap.values()],
  };
}
