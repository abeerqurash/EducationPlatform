import { sql } from "drizzle-orm";
import { check, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { practiceAttempts } from "./practice-attempts";
import type { QuestionContent, QuestionState } from "../question-bank/contract";

export const questionEntries = pgTable("question_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, table => [uniqueIndex("question_entries_slug_uidx").on(table.slug), check("question_entries_slug_check", sql`${table.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`)]);
export const questionRevisions = pgTable("question_revisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  entryId: uuid("entry_id").notNull().references(() => questionEntries.id, { onDelete: "restrict" }),
  version: integer("version").notNull(),
  status: varchar("status", { length: 20 }).$type<QuestionState>().default("draft").notNull(),
  content: jsonb("content").$type<QuestionContent>().notNull(),
  authorUserId: uuid("author_user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  reviewerUserId: uuid("reviewer_user_id").references(() => users.id, { onDelete: "restrict" }),
  reviewNote: text("review_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
}, table => [
  uniqueIndex("question_revisions_version_uidx").on(table.entryId, table.version),
  uniqueIndex("question_revisions_published_uidx").on(table.entryId).where(sql`${table.status} = 'published'`),
  index("question_revisions_status_idx").on(table.status, table.createdAt),
  check("question_revisions_version_check", sql`${table.version} > 0`),
  check("question_revisions_status_check", sql`${table.status} IN ('draft','in_review','published','rejected','retired')`),
  check("question_revisions_content_check", sql`jsonb_typeof(${table.content}) = 'object'`),
  check("question_revisions_separate_reviewer", sql`${table.reviewerUserId} IS NULL OR ${table.reviewerUserId} <> ${table.authorUserId}`),
  check("question_revisions_review_required", sql`${table.status} NOT IN ('published','rejected','retired') OR (${table.reviewerUserId} IS NOT NULL AND ${table.reviewedAt} IS NOT NULL AND length(btrim(${table.reviewNote})) >= 10)`),
]);
export const questionPracticeSessions = pgTable("question_practice_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  exam: varchar("exam", { length: 8 }).notNull(),
  revisionIds: jsonb("revision_ids").$type<string[]>().notNull(),
  draftAnswers: jsonb("draft_answers").$type<{ questionId: string; choice: number }[]>().default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  submittedAttemptId: uuid("submitted_attempt_id").references(() => practiceAttempts.id, { onDelete: "set null" }),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
}, table => [
  index("question_practice_sessions_user_idx").on(table.userId, table.createdAt),
  check("question_practice_sessions_exam_check", sql`${table.exam} IN ('SAT','ACT')`),
  check("question_practice_sessions_revision_ids_check", sql`jsonb_typeof(${table.revisionIds}) = 'array' AND jsonb_array_length(${table.revisionIds}) BETWEEN 1 AND 20`),
  check("question_practice_sessions_draft_answers_check", sql`jsonb_typeof(${table.draftAnswers}) = 'array'`),
  check("question_sessions_expiry", sql`${table.expiresAt} > ${table.createdAt}`),
  check("question_sessions_submission", sql`${table.submittedAttemptId} IS NULL OR ${table.submittedAt} IS NOT NULL`),
]);
