import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import {
  archiveColumns,
  timestampColumns,
} from "./common";

import {
  publicationStatusEnum,
  toolAccessEnum,
  verificationStatusEnum,
} from "./enums";

export interface ToolMetadata {
  icon?: string;
  keywords?: string[];
  estimatedMinutes?: number;
  featuredLabel?: string;
}

export interface CalculatorConfiguration {
  precision?: number;
  roundingMode?: string;
  resultFormat?: string;
  featureFlags?: Record<string, boolean>;
}

export const toolCategories = pgTable(
  "tool_categories",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    parentId: uuid("parent_id"),

    name: varchar("name", {
      length: 120,
    }).notNull(),

    slug: varchar("slug", {
      length: 160,
    }).notNull(),

    description: text("description"),

    sortOrder: integer("sort_order")
      .notNull()
      .default(0),

    isActive: boolean("is_active")
      .notNull()
      .default(true),

    ...archiveColumns,
    ...timestampColumns,
  },
  (table) => [
    uniqueIndex(
      "tool_categories_slug_uidx",
    ).on(table.slug),

    index("tool_categories_parent_idx").on(
      table.parentId,
    ),

    index("tool_categories_active_idx").on(
      table.isActive,
    ),
  ],
);

export const tools = pgTable(
  "tools",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    categoryId: uuid("category_id").references(
      () => toolCategories.id,
      {
        onDelete: "set null",
      },
    ),

    name: varchar("name", {
      length: 180,
    }).notNull(),

    slug: varchar("slug", {
      length: 200,
    }).notNull(),

    shortDescription: varchar(
      "short_description",
      {
        length: 500,
      },
    ),

    description: text("description"),

    access: toolAccessEnum("access")
      .notNull()
      .default("free"),

    status: publicationStatusEnum("status")
      .notNull()
      .default("draft"),

    currentVersion: varchar(
      "current_version",
      {
        length: 50,
      },
    ),

    applicableYear: integer(
      "applicable_year",
    ),

    lastReviewedAt: timestamp(
      "last_reviewed_at",
      {
        withTimezone: true,
      },
    ),

    isFeatured: boolean("is_featured")
      .notNull()
      .default(false),

    metadata: jsonb("metadata")
      .$type<ToolMetadata>(),

    ...archiveColumns,
    ...timestampColumns,
  },
  (table) => [
    uniqueIndex("tools_slug_uidx").on(
      table.slug,
    ),

    index("tools_category_idx").on(
      table.categoryId,
    ),

    index("tools_status_idx").on(
      table.status,
    ),

    index("tools_access_idx").on(
      table.access,
    ),

    index("tools_featured_idx").on(
      table.isFeatured,
    ),
  ],
);

export const calculatorVersions = pgTable(
  "calculator_versions",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    toolId: uuid("tool_id")
      .notNull()
      .references(() => tools.id, {
        onDelete: "cascade",
      }),

    version: varchar("version", {
      length: 50,
    }).notNull(),

    applicableYear: integer(
      "applicable_year",
    ),

    effectiveFrom: timestamp(
      "effective_from",
      {
        withTimezone: true,
      },
    ),

    effectiveUntil: timestamp(
      "effective_until",
      {
        withTimezone: true,
      },
    ),

    methodology: text("methodology"),

    configuration: jsonb("configuration")
      .$type<CalculatorConfiguration>(),

    verificationStatus:
      verificationStatusEnum(
        "verification_status",
      )
        .notNull()
        .default("unverified"),

    isActive: boolean("is_active")
      .notNull()
      .default(false),

    ...timestampColumns,
  },
  (table) => [
    uniqueIndex(
      "calculator_versions_tool_version_uidx",
    ).on(
      table.toolId,
      table.version,
    ),

    index(
      "calculator_versions_tool_idx",
    ).on(table.toolId),

    index(
      "calculator_versions_year_idx",
    ).on(table.applicableYear),

    index(
      "calculator_versions_active_idx",
    ).on(table.isActive),
  ],
);

export type ToolCategory =
  typeof toolCategories.$inferSelect;

export type Tool =
  typeof tools.$inferSelect;

export type NewTool =
  typeof tools.$inferInsert;

export type CalculatorVersion =
  typeof calculatorVersions.$inferSelect;