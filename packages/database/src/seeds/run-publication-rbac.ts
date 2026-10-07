import {
  seedPublicationRBAC,
} from "./publication-rbac";

async function main() {
  try {
    const result =
      await seedPublicationRBAC();

    console.log(
      "Publication RBAC seed complete.",
    );

    console.log(
      result,
    );

    if (
      result.missingRoles
        .length > 0
    ) {
      console.warn(
        "Publication permissions were not assigned to missing role keys:",
        result.missingRoles,
      );
    }

    process.exitCode = 0;
  } catch (error) {
    console.error(
      "Publication RBAC seed failed:",
      error,
    );

    process.exitCode = 1;
  }
}

void main();
