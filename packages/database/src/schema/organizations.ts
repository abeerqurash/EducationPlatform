import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import {
  archiveColumns,
  timestampColumns,
} from "./common";

import {
  membershipStatusEnum,
  organizationTypeEnum,
} from "./enums";

import { users } from "./users";

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    parentId: uuid("parent_id"),

    name: varchar("name", {
      length: 200,
    }).notNull(),

    slug: varchar("slug", {
      length: 200,
    }).notNull(),

    type: organizationTypeEnum("type")
      .notNull()
      .default("school"),

    description: text("description"),

    website: text("website"),

    countryCode: varchar("country_code", {
      length: 2,
    }),

    timezone: varchar("timezone", {
      length: 100,
    }),

    seatLimit: integer("seat_limit"),

    isActive: boolean("is_active")
      .notNull()
      .default(true),

    ...archiveColumns,
    ...timestampColumns,
  },
  (table) => [
    uniqueIndex("organizations_slug_uidx").on(
      table.slug,
    ),

    index("organizations_parent_idx").on(
      table.parentId,
    ),

    index("organizations_type_idx").on(
      table.type,
    ),

    index("organizations_active_idx").on(
      table.isActive,
    ),
  ],
);

export const organizationMemberships = pgTable(
  "organization_memberships",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    status: membershipStatusEnum("status")
      .notNull()
      .default("active"),

    title: varchar("title", {
      length: 150,
    }),

    isOwner: boolean("is_owner")
      .notNull()
      .default(false),

    ...timestampColumns,
  },
  (table) => [
    uniqueIndex(
      "organization_memberships_org_user_uidx",
    ).on(
      table.organizationId,
      table.userId,
    ),

    index(
      "organization_memberships_org_idx",
    ).on(table.organizationId),

    index(
      "organization_memberships_user_idx",
    ).on(table.userId),

    index(
      "organization_memberships_status_idx",
    ).on(table.status),
  ],
);

export type Organization =
  typeof organizations.$inferSelect;

export type NewOrganization =
  typeof organizations.$inferInsert;

export type OrganizationMembership =
  typeof organizationMemberships.$inferSelect;