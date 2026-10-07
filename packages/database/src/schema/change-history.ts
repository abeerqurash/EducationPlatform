import {
  index,
  jsonb,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestampColumns } from "./common";
import { users } from "./users";

export interface ChangeSnapshot {
  [key: string]: unknown;
}

export const changeHistory = pgTable(
  "change_history",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    entityType: varchar("entity_type", {
      length: 100,
    }).notNull(),

    entityId: uuid("entity_id").notNull(),

    version: varchar("version", {
      length: 50,
    }),

    changedByUserId: uuid(
      "changed_by_user_id",
    ).references(() => users.id, {
      onDelete: "set null",
    }),

    summary: text("summary"),

    before: jsonb("before")
      .$type<ChangeSnapshot>(),

    after: jsonb("after")
      .$type<ChangeSnapshot>(),

    ...timestampColumns,
  },
  (table) => [
    index("change_history_entity_idx").on(
      table.entityType,
      table.entityId,
    ),

    index("change_history_user_idx").on(
      table.changedByUserId,
    ),
  ],
);