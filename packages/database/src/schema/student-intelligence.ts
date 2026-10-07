import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestampColumns } from "./common";
import { users } from "./users";

export const studentProfiles = pgTable(
  "student_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    timezone: varchar("timezone", { length: 80 }).notNull().default("UTC"),
    weeklyStudyTargetMinutes: integer("weekly_study_target_minutes")
      .notNull()
      .default(300),
    emailStudyReminders: boolean("email_study_reminders")
      .notNull()
      .default(false),
    preferences: jsonb("preferences")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    ...timestampColumns,
  },
  (table) => [
    uniqueIndex("student_profiles_user_uidx").on(table.userId),
  ],
);

export const studyGoals = pgTable(
  "study_goals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 160 }).notNull(),
    description: text("description"),
    targetDate: date("target_date", { mode: "string" }),
    targetMinutes: integer("target_minutes"),
    completedAt: date("completed_at", { mode: "string" }),
    isArchived: boolean("is_archived").notNull().default(false),
    ...timestampColumns,
  },
  (table) => [
    index("study_goals_user_created_idx").on(table.userId, table.createdAt),
    index("study_goals_user_archived_idx").on(table.userId, table.isArchived),
  ],
);

export const studyActivities = pgTable(
  "study_activities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    activityType: varchar("activity_type", { length: 80 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    durationMinutes: integer("duration_minutes").notNull().default(0),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    ...timestampColumns,
  },
  (table) => [
    index("study_activities_user_created_idx").on(
      table.userId,
      table.createdAt,
    ),
    index("study_activities_user_type_idx").on(
      table.userId,
      table.activityType,
    ),
  ],
);
