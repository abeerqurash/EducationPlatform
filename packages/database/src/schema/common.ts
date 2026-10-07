import {
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const timestampColumns = {
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
};

export const archiveColumns = {
  isArchived: boolean("is_archived")
    .notNull()
    .default(false),

  archivedAt: timestamp("archived_at", {
    withTimezone: true,
  }),
};