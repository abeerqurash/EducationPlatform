import {
  boolean,
  index,
  jsonb,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestampColumns } from "./common";
import { tools } from "./tools";
import { users } from "./users";

export type StudentResultPayload =
  Record<string, unknown>;

export const studentCalculatorResults = pgTable(
  "student_calculator_results",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    toolId: uuid("tool_id")
      .references(() => tools.id, {
        onDelete: "set null",
      }),

    toolSlug: varchar("tool_slug", {
      length: 200,
    }).notNull(),

    toolName: varchar("tool_name", {
      length: 180,
    }).notNull(),

    calculatorVersion: varchar(
      "calculator_version",
      {
        length: 50,
      },
    ),

    inputSnapshot: jsonb("input_snapshot")
      .$type<StudentResultPayload>()
      .notNull(),

    resultSnapshot: jsonb("result_snapshot")
      .$type<StudentResultPayload>()
      .notNull(),

    summary: varchar("summary", {
      length: 300,
    }).notNull(),

    isSaved: boolean("is_saved")
      .notNull()
      .default(true),

    ...timestampColumns,
  },
  (table) => [
    index("student_results_user_created_idx").on(
      table.userId,
      table.createdAt,
    ),
    index("student_results_user_saved_idx").on(
      table.userId,
      table.isSaved,
    ),
    index("student_results_tool_slug_idx").on(
      table.toolSlug,
    ),
  ],
);

export type StudentCalculatorResult =
  typeof studentCalculatorResults.$inferSelect;
