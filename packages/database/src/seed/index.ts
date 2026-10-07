import {
  client,
} from "../client";

import {
  seedRbac,
} from "./rbac";

async function main() {
  console.log(
    "Starting database seed...",
  );

  await seedRbac();

  console.log(
    "Database seed completed successfully.",
  );
}

main()
  .catch((error: unknown) => {
    console.error(
      "Database seed failed:",
      error,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });