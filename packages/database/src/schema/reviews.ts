import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestampColumns } from "./common";
import { reviewStatusEnum } from "./enums";
import { users } from "./users";

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    reviewerId: uuid("reviewer_id")
      .references(() => users.id, {
        onDelete: "set null",
      }),

    entityType: varchar("entity_type", {
      length: 100,
    }).notNull(),

    entityId: uuid("entity_id").notNull(),

    status: reviewStatusEnum("status")
      .notNull()
      .default("pending"),

    notes: text("notes"),

    reviewedAt: timestamp("reviewed_at", {
      withTimezone: true,
    }),

    ...timestampColumns,
  },
  (table) => [
    index("reviews_entity_idx").on(
      table.entityType,
      table.entityId,
    ),

    index("reviews_reviewer_idx").on(
      table.reviewerId,
    ),

    index("reviews_status_idx").on(
      table.status,
    ),
  ],
);