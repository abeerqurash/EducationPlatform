import {
    seedMathCalculatorsBatch9,
} from "./math-calculators-batch-9";

async function main() {
    try {
        await seedMathCalculatorsBatch9();

        process.exitCode = 0;
    } catch (error) {
        console.error(
            "Batch 9 math calculator seed failed:",
            error,
        );

        process.exitCode = 1;
    }
}

void main();