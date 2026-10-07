import {
  index,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestampColumns } from "./common";
import { users } from "./users";

export const roles = pgTable(
  "roles",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    name: varchar("name", {
      length: 100,
    }).notNull(),

    key: varchar("key", {
      length: 100,
    }).notNull(),

    description: text("description"),

    ...timestampColumns,
  },
  (table) => [
    uniqueIndex("roles_key_uidx").on(table.key),
  ],
);

export const permissions = pgTable(
  "permissions",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    key: varchar("key", {
      length: 160,
    }).notNull(),

    description: text("description"),

    ...timestampColumns,
  },
  (table) => [
    uniqueIndex("permissions_key_uidx").on(
      table.key,
    ),
  ],
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, {
        onDelete: "cascade",
      }),

    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [
    primaryKey({
      columns: [
        table.roleId,
        table.permissionId,
      ],
    }),
  ],
);

export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [
    primaryKey({
      columns: [
        table.userId,
        table.roleId,
      ],
    }),

    index("user_roles_user_idx").on(
      table.userId,
    ),

    index("user_roles_role_idx").on(
      table.roleId,
    ),
  ],
);