import { index, integer, jsonb, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestampColumns } from "./common";
import { users } from "./users";
import type { QuestionSnapshot } from "../question-bank/contract";

/** Saved attempts are private to the authenticated student. */
export const practiceAttempts = pgTable("practice_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  exam: varchar("exam", { length: 8 }).notNull(),
  total: integer("total").notNull(),
  answered: integer("answered").notNull(),
  correct: integer("correct").notNull(),
  incorrect: integer("incorrect").notNull(),
  unanswered: integer("unanswered").notNull(),
  percentage: integer("percentage").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  questionIds: jsonb("question_ids").$type<string[]>().notNull(),
  questionSnapshots: jsonb("question_snapshots").$type<QuestionSnapshot[]>().default([]).notNull(),
  answers: jsonb("answers").$type<{questionId:string;choice:number}[]>().notNull(),
  topicBreakdown: jsonb("topic_breakdown").$type<{topic:string;total:number;answered:number;correct:number}[]>().notNull(),
  ...timestampColumns,
}, table => [
  index("practice_attempts_user_created_idx").on(table.userId, table.createdAt),
  index("practice_attempts_user_exam_created_idx").on(table.userId, table.exam, table.createdAt),
]);
export type PracticeAttemptRow = typeof practiceAttempts.$inferSelect;
