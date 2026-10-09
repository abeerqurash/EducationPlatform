import { and, desc, eq, lt } from "drizzle-orm";
import { db } from "../client";
import { practiceAttempts } from "../schema/practice-attempts";
import type { PracticeAttemptResult } from "../publication/practice-attempt-contract";

/** Call only after server-side authentication and trusted grading. */
export async function savePracticeAttempt(userId: string, result: PracticeAttemptResult) {
  if (!userId) throw new Error("Authenticated user required");
  const [saved] = await db.insert(practiceAttempts).values({
    userId, exam: result.exam, total: result.total, answered: result.answered,
    correct: result.correct, incorrect: result.incorrect, unanswered: result.unanswered,
    percentage: result.percentage, durationSeconds: result.durationSeconds,
    questionIds: [...result.questionIds], answers: [...result.answers],
    topicBreakdown: [...result.topicBreakdown],
  }).returning({ id: practiceAttempts.id, createdAt: practiceAttempts.createdAt });
  if (!saved) throw new Error("Unable to save practice attempt");
  return saved;
}

export async function listPracticeAttempts(userId: string, options: { exam?: "SAT" | "ACT"; limit?: number; before?: Date } = {}) {
  if (!userId) throw new Error("Authenticated user required");
  const limit = Math.min(100, Math.max(1, Math.floor(options.limit ?? 20)));
  const conditions = [eq(practiceAttempts.userId, userId)];
  if (options.exam) conditions.push(eq(practiceAttempts.exam, options.exam));
  if (options.before) conditions.push(lt(practiceAttempts.createdAt, options.before));
  return db.select({
    id: practiceAttempts.id, exam: practiceAttempts.exam,
    total: practiceAttempts.total, answered: practiceAttempts.answered,
    correct: practiceAttempts.correct, incorrect: practiceAttempts.incorrect,
    unanswered: practiceAttempts.unanswered, percentage: practiceAttempts.percentage,
    durationSeconds: practiceAttempts.durationSeconds,
    topicBreakdown: practiceAttempts.topicBreakdown, createdAt: practiceAttempts.createdAt,
  }).from(practiceAttempts).where(and(...conditions)).orderBy(desc(practiceAttempts.createdAt), desc(practiceAttempts.id)).limit(limit);
}

export async function getPracticeAttempt(userId: string, attemptId: string) {
  if (!userId || !attemptId) throw new Error("Authenticated user and attempt required");
  const [row] = await db.select().from(practiceAttempts)
    .where(and(eq(practiceAttempts.userId, userId), eq(practiceAttempts.id, attemptId))).limit(1);
  return row ?? null;
}

export async function deletePracticeAttempt(userId: string, attemptId: string) {
  if (!userId || !attemptId) throw new Error("Authenticated user and attempt required");
  const [row] = await db.delete(practiceAttempts)
    .where(and(eq(practiceAttempts.userId, userId), eq(practiceAttempts.id, attemptId)))
    .returning({ id: practiceAttempts.id });
  return Boolean(row);
}
