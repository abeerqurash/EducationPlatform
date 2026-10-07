import {
  seedDigitalSat,
} from "./digital-sat";

async function main() {
  try {
    await seedDigitalSat();

    process.exitCode = 0;
  } catch (error) {
    console.error(
      "Digital SAT seed failed:",
      error,
    );

    process.exitCode = 1;
  }
}

void main();