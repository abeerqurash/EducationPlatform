"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { deletePracticeAttempt, getPracticeAttempt, listPracticeAttempts, savePracticeAttempt } from "@education/database";
import { gradeTrustedPracticeAttempt, InvalidPracticeAttempt } from "@education/database/practice-contract";
import { PRACTICE_QUESTIONS } from "@/app/dashboard/test-prep/practice/question-bank";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
async function requireUserId() {
  const session = await auth();
  const id = session?.user?.id?.trim();
  if (!id || !UUID.test(id)) throw new Error("Authentication required");
  return id;
}
export async function savePracticeAttemptAction(payload: unknown) {
  const id = await requireUserId();
  try {
    const trustedQuestions = PRACTICE_QUESTIONS.map(question => ({
      id: question.id, exam: question.exam, topic: question.topic,
      correct: question.correct, choiceCount: question.choices.length,
    }));
    const result = gradeTrustedPracticeAttempt(payload, trustedQuestions, { maxQuestions: 24 });
    const saved = await savePracticeAttempt(id, result);
    revalidatePath("/dashboard/test-prep/practice/history");
    return { ok: true as const, id: saved.id, score: result.percentage };
  } catch (error) {
    if (error instanceof InvalidPracticeAttempt) return { ok: false as const, error: error.message };
    throw error;
  }
}
export async function listPracticeAttemptsAction(exam?: "SAT" | "ACT") {
  const id = await requireUserId();
  return listPracticeAttempts(id, { exam, limit: 50 });
}
export async function getPracticeAttemptAction(attemptId: string) {
  const id = await requireUserId();
  if (!UUID.test(attemptId)) return null;
  return getPracticeAttempt(id, attemptId);
}
export async function deletePracticeAttemptAction(attemptId: string) {
  const id = await requireUserId();
  if (!UUID.test(attemptId)) return { ok: false as const };
  const ok = await deletePracticeAttempt(id, attemptId);
  if (ok) revalidatePath("/dashboard/test-prep/practice/history");
  return { ok };
}
