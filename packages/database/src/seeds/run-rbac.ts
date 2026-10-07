import {
  seedCalculatorRBAC,
} from "./rbac";

async function main() {
  try {
    await seedCalculatorRBAC();

    process.exitCode = 0;
  } catch (error) {
    console.error(
      "Calculator RBAC seed failed:",
      error,
    );

    process.exitCode = 1;
  }
}

void main();