import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestampColumns } from "./common";
import { users } from "./users";

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    type: varchar("type", {
      length: 50,
    }).notNull(),

    provider: varchar("provider", {
      length: 100,
    }).notNull(),

    providerAccountId: varchar(
      "provider_account_id",
      {
        length: 255,
      },
    ).notNull(),

    refreshToken: text("refresh_token"),

    accessToken: text("access_token"),

    expiresAt: integer("expires_at"),

    tokenType: varchar("token_type", {
      length: 100,
    }),

    scope: text("scope"),

    idToken: text("id_token"),

    sessionState: text("session_state"),
  },
  (table) => [
    primaryKey({
      columns: [
        table.provider,
        table.providerAccountId,
      ],
    }),

    index("accounts_user_idx").on(
      table.userId,
    ),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: varchar(
      "session_token",
      {
        length: 255,
      },
    ).primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    expires: timestamp("expires", {
      withTimezone: true,
    }).notNull(),

    ...timestampColumns,
  },
  (table) => [
    index("sessions_user_idx").on(
      table.userId,
    ),

    index("sessions_expires_idx").on(
      table.expires,
    ),
  ],
);

export const verificationTokens =
  pgTable(
    "verification_tokens",
    {
      identifier: varchar(
        "identifier",
        {
          length: 320,
        },
      ).notNull(),

      token: varchar("token", {
        length: 255,
      }).notNull(),

      expires: timestamp("expires", {
        withTimezone: true,
      }).notNull(),
    },
    (table) => [
      primaryKey({
        columns: [
          table.identifier,
          table.token,
        ],
      }),

      uniqueIndex(
        "verification_tokens_token_uidx",
      ).on(table.token),

      index(
        "verification_tokens_expires_idx",
      ).on(table.expires),
    ],
  );

export const authenticators = pgTable(
  "authenticators",
  {
    credentialId: text(
      "credential_id",
    ).notNull(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    providerAccountId: text(
      "provider_account_id",
    ).notNull(),

    credentialPublicKey: text(
      "credential_public_key",
    ).notNull(),

    counter: integer("counter")
      .notNull(),

    credentialDeviceType: text(
      "credential_device_type",
    ).notNull(),

    credentialBackedUp: boolean(
      "credential_backed_up",
    ).notNull(),

    transports: text("transports"),
  },
  (table) => [
    primaryKey({
      columns: [
        table.userId,
        table.credentialId,
      ],
    }),

    uniqueIndex(
      "authenticators_credential_uidx",
    ).on(table.credentialId),
  ],
);