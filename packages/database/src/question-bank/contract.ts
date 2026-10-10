import { gradeTrustedPracticeAttempt, InvalidPracticeAttempt, type PracticeAnswerInput } from "../publication/practice-attempt-contract";

export const questionBankPermissions = { author: "questions.author", review: "questions.review" } as const;
export type QuestionState = "draft" | "in_review" | "published" | "rejected" | "retired";
export type QuestionContent = Readonly<{
  exam: "SAT" | "ACT" | "Both";
  topic: "Math" | "Reading" | "English" | "Science";
  difficulty: "foundation" | "intermediate" | "advanced";
  prompt: string; choices: readonly string[]; correct: number; explanation: string; source: string;
}>;
export type QuestionSnapshot = QuestionContent & Readonly<{ id: string; entryId: string; version: number }>;
export type StudentQuestion = Omit<QuestionSnapshot, "correct" | "explanation" | "source">;
export class QuestionBankError extends Error {
  constructor(message: string) { super(message); this.name = "QuestionBankError"; }
}
export const isQuestionId = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const own = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (message: string): never => { throw new QuestionBankError(message); };
function text(value: unknown, name: string, min: number, max: number) {
  if (typeof value !== "string") return fail(`${name} is required.`);
  const result = value.trim();
  if (result.length < min || result.length > max) return fail(`${name} must be ${min}-${max} characters.`);
  return result;
}
export function parseQuestionContent(value: unknown): QuestionContent {
  if (!own(value)) return fail("Invalid question content.");
  const exam = value.exam;
  const topic = value.topic;
  const difficulty = value.difficulty;
  if (exam !== "SAT" && exam !== "ACT" && exam !== "Both") return fail("Choose SAT, ACT or Both.");
  if (topic !== "Math" && topic !== "Reading" && topic !== "English" && topic !== "Science") return fail("Invalid topic.");
  if (topic === "Science" && exam !== "ACT") return fail("Science questions must be ACT-only.");
  if (difficulty !== "foundation" && difficulty !== "intermediate" && difficulty !== "advanced") return fail("Invalid difficulty.");
  if (!Array.isArray(value.choices) || value.choices.length < 2 || value.choices.length > 6) return fail("Provide 2-6 choices.");
  const choices = value.choices.map(choice => text(choice, "Choice", 1, 1000));
  if (new Set(choices.map(choice => choice.toLowerCase())).size !== choices.length) return fail("Choices must be distinct.");
  if (typeof value.correct !== "number" || !Number.isSafeInteger(value.correct) || value.correct < 0 || value.correct >= choices.length) return fail("Correct choice must be in range.");
  return { exam, topic, difficulty, prompt: text(value.prompt, "Prompt", 10, 10000), choices, correct: value.correct,
    explanation: text(value.explanation, "Explanation", 20, 10000), source: text(value.source, "Source/provenance", 10, 2000) };
}
export function questionSlug(value: unknown) {
  if (typeof value !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || value.length > 100) return fail("Use a slug of up to 100 lowercase letters, numbers and hyphens.");
  return value;
}
export function reviewReason(value: unknown) { return text(value, "Editorial note", 10, 1000); }
export function authorizeQuestionTransition(actor: { userId: string; permissionKeys: readonly string[] }, revision: { status: string; authorUserId: string }, action: "submit" | "publish" | "reject" | "retire"): QuestionState {
  const permission = action === "submit" ? questionBankPermissions.author : questionBankPermissions.review;
  if (!actor.permissionKeys.includes(permission)) return fail("Question-bank permission required.");
  if (action === "submit") {
    if (revision.status !== "draft" || revision.authorUserId !== actor.userId) return fail("Only the author can submit their draft.");
    return "in_review";
  }
  if (action === "retire") {
    if (revision.status !== "published") return fail("Only a published revision can be retired.");
    return "retired";
  }
  if (revision.status !== "in_review") return fail("This revision is not awaiting review.");
  if (revision.authorUserId === actor.userId) return fail("A different reviewer must publish or reject this revision.");
  return action === "publish" ? "published" : "rejected";
}
export function studentQuestion(row: QuestionSnapshot): StudentQuestion {
  return { id: row.id, entryId: row.entryId, version: row.version, exam: row.exam, topic: row.topic,
    difficulty: row.difficulty, prompt: row.prompt, choices: [...row.choices] };
}
export function parseLibraryAnswers(value: unknown): PracticeAnswerInput[] {
  if (!Array.isArray(value) || value.length > 20) return fail("Invalid answer submission.");
  const seen = new Set<string>();
  return value.map(row => {
    if (!own(row) || !isQuestionId(row.questionId) || typeof row.choice !== "number" || !Number.isSafeInteger(row.choice) || row.choice < 0 || row.choice > 5 || seen.has(row.questionId)) return fail("Invalid or duplicate answer.");
    seen.add(row.questionId);
    return { questionId: row.questionId, choice: row.choice };
  });
}
export function gradeLibrarySession(session: { exam: string; revisionIds: string[]; createdAt: Date; expiresAt: Date }, revisions: readonly QuestionSnapshot[], answers: unknown, now: Date) {
  if (now.getTime() > session.expiresAt.getTime() || now.getTime() < session.createdAt.getTime()) return fail("This practice session has expired. Start a new session.");
  const byId = new Map(revisions.map(row => [row.id, row]));
  if (byId.size !== revisions.length || session.revisionIds.some(id => !byId.has(id))) return fail("Question revisions are unavailable.");
  try {
    return gradeTrustedPracticeAttempt({ exam: session.exam, questionIds: session.revisionIds, answers: parseLibraryAnswers(answers),
      startedAt: session.createdAt.toISOString(), submittedAt: now.toISOString() }, revisions.map(row => ({ id: row.id, exam: row.exam, topic: row.topic, correct: row.correct, choiceCount: row.choices.length })), { maxQuestions: 20 });
  } catch (error) { if (error instanceof InvalidPracticeAttempt) return fail(error.message); throw error; }
}
