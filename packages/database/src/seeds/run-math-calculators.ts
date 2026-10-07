import {
    seedMathCalculators,
} from "./math-calculators";

async function main() {
    try {
        await seedMathCalculators();

        process.exitCode = 0;
    } catch (error) {
        console.error(
            "Math calculator seed failed:",
            error,
        );

        process.exitCode = 1;
    }
}

void main();