import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  getDatabaseEnvironment,
} from "./env";

import * as schema from "./schema";

const globalForDatabase =
  globalThis as unknown as {
    postgresClient?: ReturnType<
      typeof postgres
    >;
  };

function createPostgresClient() {
  const { DATABASE_URL } =
    getDatabaseEnvironment();

  return postgres(DATABASE_URL, {
    max:
      process.env.NODE_ENV ===
      "production"
        ? 10
        : 5,

    idle_timeout: 20,

    connect_timeout: 10,

    prepare: false,
  });
}

const client =
  globalForDatabase.postgresClient ??
  createPostgresClient();

if (
  process.env.NODE_ENV !== "production"
) {
  globalForDatabase.postgresClient =
    client;
}

export const db = drizzle(client, {
  schema,
});

export { client };