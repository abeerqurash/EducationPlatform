import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "../client";
import { auditLogs } from "../schema/audit";
import { questionEntries, questionRevisions } from "../schema/question-bank";
import { requireBankPermission, type BankTransaction } from "./access";
import { authorizeQuestionTransition, isQuestionId, parseQuestionContent, QuestionBankError, questionBankPermissions, questionSlug, reviewReason } from "./contract";

const allPermissions = Object.values(questionBankPermissions);
async function audit(tx: BankTransaction, userId: string, entityId: string, action: "create" | "publish" | "reject" | "archive" | "update", metadata: Record<string, unknown>) {
  await tx.insert(auditLogs).values({ actorUserId: userId, action, entityType: "question_revision", entityId, metadata });
}
async function draft(tx: BankTransaction, userId: string, slug: string, content: ReturnType<typeof parseQuestionContent>, entryId?: string) {
  let id = entryId;
  if (!id) {
    const [entry] = await tx.insert(questionEntries).values({ slug }).onConflictDoNothing().returning({ id: questionEntries.id });
    if (!entry) throw new QuestionBankError("That slug already exists. Create a new revision from its detail page.");
    id = entry.id;
  }
  const [entry] = await tx.select().from(questionEntries).where(eq(questionEntries.id, id)).for("update");
  if (!entry) throw new QuestionBankError("Question entry unavailable.");
  const [latest] = await tx.select({ version: questionRevisions.version }).from(questionRevisions).where(eq(questionRevisions.entryId, id)).orderBy(desc(questionRevisions.version)).limit(1);
  const [revision] = await tx.insert(questionRevisions).values({ entryId: id, version: (latest?.version ?? 0) + 1, authorUserId: userId, content }).returning();
  if (!revision) throw new QuestionBankError("Unable to create draft.");
  await audit(tx, userId, revision.id, "create", { entryId: id, version: revision.version });
  return revision;
}
export async function createQuestionDraft(userId: string, input: { slug?: unknown; entryId?: unknown; content: unknown }) {
  const content = parseQuestionContent(input.content);
  const entryId = input.entryId;
  if (entryId !== undefined && !isQuestionId(entryId)) throw new QuestionBankError("Invalid entry.");
  const slug = entryId === undefined ? questionSlug(input.slug) : "";
  return db.transaction(async tx => {
    await requireBankPermission(tx, userId, [questionBankPermissions.author]);
    return draft(tx, userId, slug, content, entryId as string | undefined);
  });
}
export async function transitionQuestionRevision(userId: string, revisionId: string, action: "submit" | "publish" | "reject" | "retire", note: unknown) {
  if (!isQuestionId(revisionId)) throw new QuestionBankError("Invalid revision.");
  const reason = action === "submit" ? null : reviewReason(note);
  return db.transaction(async tx => {
    const actor = await requireBankPermission(tx, userId, [action === "submit" ? questionBankPermissions.author : questionBankPermissions.review]);
    // Lock order is consistently entry then revision, serializing versioning/publication.
    const [reference] = await tx.select({ entryId: questionRevisions.entryId }).from(questionRevisions).where(eq(questionRevisions.id, revisionId));
    if (!reference) throw new QuestionBankError("Revision unavailable.");
    await tx.select().from(questionEntries).where(eq(questionEntries.id, reference.entryId)).for("update");
    const [revision] = await tx.select().from(questionRevisions).where(eq(questionRevisions.id, revisionId)).for("update");
    if (!revision) throw new QuestionBankError("Revision unavailable.");
    const next = authorizeQuestionTransition(actor, revision, action);
    parseQuestionContent(revision.content);
    if (action === "publish") {
      // Older reviewed versions remain available for in-flight and historical attempts.
      const retired = await tx.update(questionRevisions).set({ status: "retired" }).where(and(eq(questionRevisions.entryId, revision.entryId), eq(questionRevisions.status, "published"))).returning({ id: questionRevisions.id });
      for (const old of retired) await audit(tx, userId, old.id, "archive", { replacementRevisionId: revisionId, reason });
    }
    await tx.update(questionRevisions).set({ status: next,
      ...(action === "publish" || action === "reject" ? { reviewerUserId: userId, reviewNote: reason, reviewedAt: new Date() } : {})
    }).where(eq(questionRevisions.id, revisionId));
    await audit(tx, userId, revisionId, action === "publish" ? "publish" : action === "reject" ? "reject" : action === "retire" ? "archive" : "update", { entryId: revision.entryId, version: revision.version, from: revision.status, to: next, reason });
  });
}
export async function listQuestionRevisions(userId: string, options: { query?: string; status?: string; page?: number } = {}) {
  const page = Number.isSafeInteger(options.page) ? Math.max(1, Math.min(10000, options.page!)) : 1;
  return db.transaction(async tx => {
    await requireBankPermission(tx, userId, allPermissions);
    const where = and(options.query ? ilike(questionEntries.slug, `%${options.query.trim().slice(0, 100)}%`) : undefined,
      ["draft", "in_review", "published", "rejected", "retired"].includes(options.status ?? "") ? eq(questionRevisions.status, options.status as typeof questionRevisions.$inferSelect.status) : undefined);
    const rows = await tx.select({ revision: questionRevisions, slug: questionEntries.slug }).from(questionRevisions).innerJoin(questionEntries, eq(questionEntries.id, questionRevisions.entryId)).where(where).orderBy(desc(questionRevisions.createdAt), asc(questionRevisions.id)).limit(25).offset((page - 1) * 25);
    const [total] = await tx.select({ count: sql<number>`count(*)::int` }).from(questionRevisions).innerJoin(questionEntries, eq(questionEntries.id, questionRevisions.entryId)).where(where);
    return { rows, page, total: total?.count ?? 0 };
  });
}
export async function getQuestionRevision(userId: string, revisionId: string) {
  if (!isQuestionId(revisionId)) return null;
  return db.transaction(async tx => {
    await requireBankPermission(tx, userId, allPermissions);
    const [row] = await tx.select({ revision: questionRevisions, slug: questionEntries.slug }).from(questionRevisions).innerJoin(questionEntries, eq(questionEntries.id, questionRevisions.entryId)).where(eq(questionRevisions.id, revisionId));
    return row ?? null;
  });
}
/** Idempotent starter import; imported items are drafts and never auto-published. */
export async function importQuestionDrafts(userId: string, input: readonly { slug: string; content: unknown }[]) {
  if (!input.length || input.length > 100) throw new QuestionBankError("Import 1-100 items.");
  const parsed = input.map(row => ({ slug: questionSlug(row.slug), content: parseQuestionContent(row.content) }));
  if (new Set(parsed.map(row => row.slug)).size !== parsed.length) throw new QuestionBankError("Duplicate import slugs.");
  return db.transaction(async tx => {
    await requireBankPermission(tx, userId, [questionBankPermissions.author]);
    let imported = 0;
    for (const row of parsed) {
      const [entry] = await tx.insert(questionEntries).values({ slug: row.slug }).onConflictDoNothing().returning({ id: questionEntries.id });
      if (!entry) continue;
      await draft(tx, userId, "", row.content, entry.id);
      imported++;
    }
    return { imported, skipped: parsed.length - imported };
  });
}
