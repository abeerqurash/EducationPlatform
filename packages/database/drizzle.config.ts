import path from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

const currentDirectory = path.dirname(
  fileURLToPath(import.meta.url),
);

config({
  path: path.resolve(
    currentDirectory,
    "../../.env.local",
  ),
});

const databaseUrl =
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required to run Drizzle commands.",
  );
}

export default defineConfig({
  schema: "./src/schema/index.ts",

  out: "./drizzle",

  dialect: "postgresql",

  dbCredentials: {
    url: databaseUrl,
  },

  strict: true,
  verbose: true,
});