import {
  index,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestampColumns } from "./common";

import {
  sourceTypeEnum,
  verificationStatusEnum,
} from "./enums";

import {
  calculatorVersions,
  tools,
} from "./tools";

export const sources = pgTable(
  "sources",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    title: varchar("title", {
      length: 300,
    }).notNull(),

    publisher: varchar("publisher", {
      length: 200,
    }),

    url: text("url").notNull(),

    type: sourceTypeEnum("type")
      .notNull()
      .default("other"),

    verificationStatus:
      verificationStatusEnum(
        "verification_status",
      )
        .notNull()
        .default("unverified"),

    notes: text("notes"),

    ...timestampColumns,
  },
  (table) => [
    uniqueIndex("sources_url_uidx").on(
      table.url,
    ),

    index("sources_type_idx").on(
      table.type,
    ),
  ],
);

export const toolSources = pgTable(
  "tool_sources",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    toolId: uuid("tool_id")
      .notNull()
      .references(() => tools.id, {
        onDelete: "cascade",
      }),

    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, {
        onDelete: "cascade",
      }),

    ...timestampColumns,
  },
  (table) => [
    uniqueIndex(
      "tool_sources_tool_source_uidx",
    ).on(
      table.toolId,
      table.sourceId,
    ),
  ],
);

export const calculatorVersionSources =
  pgTable(
    "calculator_version_sources",
    {
      id: uuid("id")
        .defaultRandom()
        .primaryKey(),

      calculatorVersionId: uuid(
        "calculator_version_id",
      )
        .notNull()
        .references(
          () => calculatorVersions.id,
          {
            onDelete: "cascade",
          },
        ),

      sourceId: uuid("source_id")
        .notNull()
        .references(() => sources.id, {
          onDelete: "cascade",
        }),

      ...timestampColumns,
    },
    (table) => [
      uniqueIndex(
        "calculator_version_sources_uidx",
      ).on(
        table.calculatorVersionId,
        table.sourceId,
      ),
    ],
  );