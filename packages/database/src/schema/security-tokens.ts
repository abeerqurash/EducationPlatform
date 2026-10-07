import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestampColumns } from "./common";
import { users } from "./users";

export const emailVerificationTokens =
  pgTable(
    "email_verification_tokens",
    {
      id: uuid("id")
        .defaultRandom()
        .primaryKey(),

      userId: uuid("user_id")
        .notNull()
        .references(() => users.id, {
          onDelete: "cascade",
        }),

      tokenHash: varchar("token_hash", {
        length: 64,
      }).notNull(),

      expiresAt: timestamp(
        "expires_at",
        {
          withTimezone: true,
        },
      ).notNull(),

      usedAt: timestamp("used_at", {
        withTimezone: true,
      }),

      ...timestampColumns,
    },
    (table) => [
      uniqueIndex(
        "email_verification_token_hash_uidx",
      ).on(table.tokenHash),

      index(
        "email_verification_user_idx",
      ).on(table.userId),

      index(
        "email_verification_expires_idx",
      ).on(table.expiresAt),
    ],
  );

export const passwordResetTokens =
  pgTable(
    "password_reset_tokens",
    {
      id: uuid("id")
        .defaultRandom()
        .primaryKey(),

      userId: uuid("user_id")
        .notNull()
        .references(() => users.id, {
          onDelete: "cascade",
        }),

      tokenHash: varchar("token_hash", {
        length: 64,
      }).notNull(),

      expiresAt: timestamp(
        "expires_at",
        {
          withTimezone: true,
        },
      ).notNull(),

      usedAt: timestamp("used_at", {
        withTimezone: true,
      }),

      ...timestampColumns,
    },
    (table) => [
      uniqueIndex(
        "password_reset_token_hash_uidx",
      ).on(table.tokenHash),

      index(
        "password_reset_user_idx",
      ).on(table.userId),

      index(
        "password_reset_expires_idx",
      ).on(table.expiresAt),
    ],
  );