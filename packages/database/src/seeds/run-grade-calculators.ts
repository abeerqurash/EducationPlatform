import {
  seedGradeCalculators,
} from "./grade-calculators";

async function main() {
  try {
    await seedGradeCalculators();

    process.exitCode = 0;
  } catch (error) {
    console.error(
      "Grade calculator seed failed:",
      error,
    );

    process.exitCode = 1;
  }
}

void main();