import {
  seedEnhancedActCalculator,
} from "./enhanced-act";

async function main() {
  try {
    await seedEnhancedActCalculator();

    process.exitCode = 0;
  } catch (error) {
    console.error(
      "Enhanced ACT seed failed:",
      error,
    );

    process.exitCode = 1;
  }
}

void main();
