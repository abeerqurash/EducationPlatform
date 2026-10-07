import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestampColumns } from "./common";
import { verificationStatusEnum } from "./enums";
import { calculatorVersions } from "./tools";

export interface FormulaDefinition {
  engine?: string;
  expression?: string;
  module?: string;
  parameters?: Record<string, unknown>;
}

export interface DatasetPayload {
  entries?: unknown[];
  mappings?: Record<string, unknown>;
}

export const formulaVersions = pgTable(
  "formula_versions",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    calculatorVersionId: uuid(
      "calculator_version_id",
    )
      .notNull()
      .references(() => calculatorVersions.id, {
        onDelete: "cascade",
      }),

    version: varchar("version", {
      length: 50,
    }).notNull(),

    definition: jsonb("definition")
      .$type<FormulaDefinition>()
      .notNull(),

    precision: integer("precision"),

    tolerance: numeric("tolerance", {
      precision: 20,
      scale: 10,
    }),

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
      "formula_versions_calc_version_uidx",
    ).on(
      table.calculatorVersionId,
      table.version,
    ),

    index(
      "formula_versions_calculator_idx",
    ).on(table.calculatorVersionId),
  ],
);

export const datasets = pgTable(
  "datasets",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    key: varchar("key", {
      length: 160,
    }).notNull(),

    name: varchar("name", {
      length: 200,
    }).notNull(),

    description: text("description"),

    ...timestampColumns,
  },
  (table) => [
    uniqueIndex("datasets_key_uidx").on(
      table.key,
    ),
  ],
);

export const datasetVersions = pgTable(
  "dataset_versions",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    datasetId: uuid("dataset_id")
      .notNull()
      .references(() => datasets.id, {
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

    payload: jsonb("payload")
      .$type<DatasetPayload>()
      .notNull(),

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
      "dataset_versions_dataset_version_uidx",
    ).on(
      table.datasetId,
      table.version,
    ),

    index(
      "dataset_versions_dataset_idx",
    ).on(table.datasetId),

    index(
      "dataset_versions_year_idx",
    ).on(table.applicableYear),
  ],
);

export const calculatorDatasets = pgTable(
  "calculator_datasets",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    calculatorVersionId: uuid(
      "calculator_version_id",
    )
      .notNull()
      .references(() => calculatorVersions.id, {
        onDelete: "cascade",
      }),

    datasetVersionId: uuid(
      "dataset_version_id",
    )
      .notNull()
      .references(() => datasetVersions.id, {
        onDelete: "restrict",
      }),

    purpose: varchar("purpose", {
      length: 150,
    }),

    ...timestampColumns,
  },
  (table) => [
    uniqueIndex(
      "calculator_datasets_calc_dataset_uidx",
    ).on(
      table.calculatorVersionId,
      table.datasetVersionId,
    ),

    index(
      "calculator_datasets_calculator_idx",
    ).on(table.calculatorVersionId),
  ],
);