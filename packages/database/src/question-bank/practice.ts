import { and, asc, desc, eq, gt, inArray, sql } from "drizzle-orm";
import { db } from "../client";
import { practiceAttempts } from "../schema/practice-attempts";
import { questionPracticeSessions, questionRevisions } from "../schema/question-bank";
import { requireActiveStudent } from "./access";
import { gradeLibrarySession, isQuestionId, parseQuestionContent, QuestionBankError, studentQuestion, type QuestionSnapshot } from "./contract";

function snapshot(row: typeof questionRevisions.$inferSelect): QuestionSnapshot {
  return { ...parseQuestionContent(row.content), id: row.id, entryId: row.entryId, version: row.version };
}
export async function startQuestionPractice(userId: string, exam: "SAT" | "ACT", topic: string = "All") {
  if (exam !== "SAT" && exam !== "ACT") throw new QuestionBankError("Invalid exam.");
  if (!["All", "Math", "Reading", "English", "Science"].includes(topic) || (exam === "SAT" && topic === "Science")) throw new QuestionBankError("Invalid topic.");
  return db.transaction(async tx => {
    await requireActiveStudent(tx, userId);
    const now = new Date();
    // One open session at a time; lock on the account row also serializes concurrent starts.
    const [open] = await tx.select().from(questionPracticeSessions).where(and(eq(questionPracticeSessions.userId, userId), sql`${questionPracticeSessions.submittedAt} IS NULL`, gt(questionPracticeSessions.expiresAt, now))).orderBy(desc(questionPracticeSessions.createdAt)).limit(1);
    if (open) throw new QuestionBankError("Resume your current library session before starting another.");
    const revisions = await tx.select().from(questionRevisions).where(and(eq(questionRevisions.status, "published"), sql`${questionRevisions.content}->>'exam' IN (${exam}, 'Both')`, topic === "All" ? undefined : sql`${questionRevisions.content}->>'topic' = ${topic}`)).orderBy(sql`random()`).limit(10);
    if (!revisions.length) throw new QuestionBankError("No reviewed questions are published for this selection yet.");
    const [session] = await tx.insert(questionPracticeSessions).values({ userId, exam, revisionIds: revisions.map(row => row.id), createdAt: now, expiresAt: new Date(now.getTime() + 4 * 60 * 60 * 1000) }).returning();
    if (!session) throw new QuestionBankError("Unable to start session.");
    return { id: session.id, exam, createdAt: session.createdAt.toISOString(), expiresAt: session.expiresAt.toISOString(), answers: session.draftAnswers, questions: revisions.map(row => studentQuestion(snapshot(row))) };
  });
}
export async function resumeQuestionPractice(userId: string) {
  return db.transaction(async tx => {
    await requireActiveStudent(tx, userId);
    const [session] = await tx.select().from(questionPracticeSessions).where(and(eq(questionPracticeSessions.userId, userId), sql`${questionPracticeSessions.submittedAt} IS NULL`, sql`${questionPracticeSessions.expiresAt} > now()`)).orderBy(desc(questionPracticeSessions.createdAt)).limit(1);
    if (!session) return null;
    const revisions = await tx.select().from(questionRevisions).where(inArray(questionRevisions.id, session.revisionIds));
    const byId = new Map(revisions.map(row => [row.id, row]));
    const questions = session.revisionIds.map(id => { const row = byId.get(id); if (!row) throw new QuestionBankError("Session questions unavailable."); return studentQuestion(snapshot(row)); });
    return { id: session.id, exam: session.exam as "SAT" | "ACT", createdAt: session.createdAt.toISOString(), expiresAt: session.expiresAt.toISOString(), answers: session.draftAnswers, questions };
  });
}
export async function submitQuestionPractice(userId: string, sessionId: string, answers: unknown) {
  if (!isQuestionId(sessionId)) throw new QuestionBankError("Invalid session.");
  return db.transaction(async tx => {
    await requireActiveStudent(tx, userId);
    const [session] = await tx.select().from(questionPracticeSessions).where(and(eq(questionPracticeSessions.id, sessionId), eq(questionPracticeSessions.userId, userId))).for("update");
    if (!session) throw new QuestionBankError("Session unavailable.");
    if (session.submittedAt) {
      const [saved] = session.submittedAttemptId ? await tx.select({ id: practiceAttempts.id, percentage: practiceAttempts.percentage }).from(practiceAttempts).where(and(eq(practiceAttempts.id, session.submittedAttemptId), eq(practiceAttempts.userId, userId))) : [];
      if (!saved) throw new QuestionBankError("This completed session's saved result was deleted. Start a new session.");
      return saved;
    }
    const revisions = await tx.select().from(questionRevisions).where(inArray(questionRevisions.id, session.revisionIds)).orderBy(asc(questionRevisions.id));
    const snapshots = revisions.map(snapshot);
    const now = new Date();
    const result = gradeLibrarySession(session, snapshots, answers, now);
    const byId = new Map(snapshots.map(row => [row.id, row]));
    const [saved] = await tx.insert(practiceAttempts).values({ userId, exam: result.exam, total: result.total,
      answered: result.answered, correct: result.correct, incorrect: result.incorrect, unanswered: result.unanswered,
      percentage: result.percentage, durationSeconds: result.durationSeconds, questionIds: [...result.questionIds],
      questionSnapshots: session.revisionIds.map(id => byId.get(id)!), answers: [...result.answers], topicBreakdown: [...result.topicBreakdown] }).returning({ id: practiceAttempts.id, percentage: practiceAttempts.percentage });
    if (!saved) throw new QuestionBankError("Unable to save result.");
    await tx.update(questionPracticeSessions).set({ submittedAt: now, submittedAttemptId: saved.id, draftAnswers: [] }).where(eq(questionPracticeSessions.id, sessionId));
    return saved;
  });
}
export async function abandonQuestionPractice(userId: string, sessionId: string) {
  if (!isQuestionId(sessionId)) throw new QuestionBankError("Invalid session.");
  return db.transaction(async tx => {
    await requireActiveStudent(tx, userId);
    await tx.delete(questionPracticeSessions).where(and(eq(questionPracticeSessions.id, sessionId), eq(questionPracticeSessions.userId, userId), sql`${questionPracticeSessions.submittedAt} IS NULL`));
  });
}
export async function saveQuestionPracticeDraft(userId: string, sessionId: string, answers: unknown) {
  if (!isQuestionId(sessionId)) throw new QuestionBankError("Invalid session.");
  return db.transaction(async tx => {
    await requireActiveStudent(tx, userId);
    const [session] = await tx.select().from(questionPracticeSessions).where(and(eq(questionPracticeSessions.id, sessionId), eq(questionPracticeSessions.userId, userId))).for("update");
    if (!session || session.submittedAt) throw new QuestionBankError("Session unavailable or already submitted.");
    const revisions = await tx.select().from(questionRevisions).where(inArray(questionRevisions.id, session.revisionIds));
    const validated = gradeLibrarySession(session, revisions.map(snapshot), answers, new Date());
    await tx.update(questionPracticeSessions).set({ draftAnswers: [...validated.answers] }).where(eq(questionPracticeSessions.id, sessionId));
  });
}
