import {
  index,
  jsonb,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestampColumns } from "./common";
import { auditActionEnum } from "./enums";
import { users } from "./users";

export interface AuditMetadata {
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  reason?: string;
  [key: string]: unknown;
}

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    actorUserId: uuid("actor_user_id")
      .references(() => users.id, {
        onDelete: "set null",
      }),

    action: auditActionEnum("action")
      .notNull(),

    entityType: varchar("entity_type", {
      length: 100,
    }),

    entityId: uuid("entity_id"),

    metadata: jsonb("metadata")
      .$type<AuditMetadata>(),

    message: text("message"),

    ...timestampColumns,
  },
  (table) => [
    index("audit_logs_actor_idx").on(
      table.actorUserId,
    ),

    index("audit_logs_action_idx").on(
      table.action,
    ),

    index("audit_logs_entity_idx").on(
      table.entityType,
      table.entityId,
    ),

    index("audit_logs_created_idx").on(
      table.createdAt,
    ),
  ],
);