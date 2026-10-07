import {
  seedGPACalculator,
} from "./gpa-calculator";

async function main() {
  try {
    await seedGPACalculator();

    process.exitCode = 0;
  } catch (error) {
    console.error(
      "GPA seed failed:",
      error,
    );

    process.exitCode = 1;
  }
}

void main();