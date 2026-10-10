import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestampColumns } from "./common";
import { userRoleEnum } from "./enums";

export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    email: varchar("email", {
      length: 320,
    }),

    name: varchar("name", {
      length: 150,
    }),

    image: text("image"),

    passwordHash: text("password_hash"),
    authVersion: integer('auth_version').notNull().default(0),

    role: userRoleEnum("role")
      .notNull()
      .default("student"),

    emailVerifiedAt: timestamp(
      "email_verified_at",
      {
        withTimezone: true,
      },
    ),

    isActive: boolean("is_active")
      .notNull()
      .default(true),

    lastLoginAt: timestamp(
      "last_login_at",
      {
        withTimezone: true,
      },
    ),

    passwordChangedAt: timestamp(
      "password_changed_at",
      {
        withTimezone: true,
      },
    ),

    ...timestampColumns,
  },
  (table) => [
    uniqueIndex("users_email_uidx").on(
      table.email,
    ),

    index("users_role_idx").on(
      table.role,
    ),

    index("users_active_idx").on(
      table.isActive,
    ),
  ],
);

export type User =
  typeof users.$inferSelect;

export type NewUser =
  typeof users.$inferInsert;
