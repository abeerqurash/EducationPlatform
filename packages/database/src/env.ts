import path from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";
import { z } from "zod";

const currentDirectory = path.dirname(
  fileURLToPath(import.meta.url),
);

const monorepoRoot = path.resolve(
  currentDirectory,
  "../../..",
);

config({
  path: path.join(
    monorepoRoot,
    ".env.local",
  ),
});

const databaseEnvironmentSchema =
  z.object({
    DATABASE_URL: z
      .string()
      .min(
        1,
        "DATABASE_URL is required.",
      )
      .startsWith(
        "postgres",
        "DATABASE_URL must be a PostgreSQL connection string.",
      ),
  });

export function getDatabaseEnvironment() {
  return databaseEnvironmentSchema.parse({
    DATABASE_URL:
      process.env.DATABASE_URL,
  });
}