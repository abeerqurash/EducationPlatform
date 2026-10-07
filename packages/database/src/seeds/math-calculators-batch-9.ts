import {
    and,
    eq,
} from "drizzle-orm";

import { db } from "../client";

import {
    calculatorVersions,
    toolCategories,
    tools,
} from "../schema/tools";

import {
    formulaVersions,
} from "../schema/calculator-engine";

const VERSION = "1.0.0";

const definitions = [
    {
        slug:
            "percentage-change-calculator",

        name:
            "Percentage Change Calculator",

        description:
            "Calculate percentage increase or decrease between an original value and a new value.",

        methodology:
            "The difference between the new and original values is divided by the magnitude of the original value and multiplied by 100.",

        module:
            "percentage-change",

        expression:
            "((newValue - originalValue) / abs(originalValue)) * 100",

        keywords: [
            "percentage change calculator",
            "percentage increase",
            "percentage decrease",
        ],
    },

    {
        slug:
            "weighted-average-calculator",

        name:
            "Weighted Average Calculator",

        description:
            "Calculate the weighted mean of multiple values with different weights.",

        methodology:
            "Each value is multiplied by its weight. The weighted products are summed and divided by the total weight.",

        module:
            "weighted-average",

        expression:
            "sum(value * weight) / sum(weight)",

        keywords: [
            "weighted average calculator",
            "weighted mean",
            "weighted grade",
        ],
    },
] as const;

async function getMathCategory() {
    const existing =
        (
            await db
                .select()
                .from(
                    toolCategories,
                )
                .where(
                    eq(
                        toolCategories.slug,
                        "math",
                    ),
                )
                .limit(1)
        )[0];

    if (!existing) {
        throw new Error(
            "Math category does not exist. Run the Batch 8 math seed first.",
        );
    }

    return existing;
}

export async function seedMathCalculatorsBatch9() {
    console.log(
        "Seeding Batch 9 math calculators...",
    );

    const category =
        await getMathCategory();

    for (
        const definition
        of definitions
    ) {
        let tool =
            (
                await db
                    .select()
                    .from(tools)
                    .where(
                        eq(
                            tools.slug,
                            definition.slug,
                        ),
                    )
                    .limit(1)
            )[0];

        const toolValues = {
            categoryId:
                category.id,

            name:
                definition.name,

            shortDescription:
                definition.description,

            description:
                definition.description,

            access:
                "free" as const,

            status:
                "published" as const,

            currentVersion:
                VERSION,

            applicableYear:
                2026,

            isFeatured: false,

            isArchived: false,

            metadata: {
                keywords:
                    [
                        ...definition.keywords,
                    ],

                estimatedMinutes:
                    1,
            },
        };

        if (!tool) {
            [tool] =
                await db
                    .insert(tools)
                    .values({
                        slug:
                            definition.slug,

                        ...toolValues,
                    })
                    .returning();
        } else {
            [tool] =
                await db
                    .update(tools)
                    .set({
                        ...toolValues,

                        updatedAt:
                            new Date(),
                    })
                    .where(
                        eq(
                            tools.id,
                            tool.id,
                        ),
                    )
                    .returning();
        }

        let calculator =
            (
                await db
                    .select()
                    .from(
                        calculatorVersions,
                    )
                    .where(
                        and(
                            eq(
                                calculatorVersions.toolId,
                                tool.id,
                            ),

                            eq(
                                calculatorVersions.version,
                                VERSION,
                            ),
                        ),
                    )
                    .limit(1)
            )[0];

        const calculatorValues = {
            applicableYear: 2026,

            effectiveFrom:
                new Date(
                    "2026-10-07T00:00:00.000Z",
                ),

            effectiveUntil:
                null,

            methodology:
                definition.methodology,

            configuration: {
                precision: 6,

                roundingMode:
                    "half-up",

                resultFormat:
                    "decimal",
            },

            verificationStatus:
                "unverified" as const,

            isActive: true,
        };

        if (!calculator) {
            [calculator] =
                await db
                    .insert(
                        calculatorVersions,
                    )
                    .values({
                        toolId:
                            tool.id,

                        version:
                            VERSION,

                        ...calculatorValues,
                    })
                    .returning();
        } else {
            [calculator] =
                await db
                    .update(
                        calculatorVersions,
                    )
                    .set({
                        ...calculatorValues,

                        updatedAt:
                            new Date(),
                    })
                    .where(
                        eq(
                            calculatorVersions.id,
                            calculator.id,
                        ),
                    )
                    .returning();
        }

        let formula =
            (
                await db
                    .select()
                    .from(
                        formulaVersions,
                    )
                    .where(
                        and(
                            eq(
                                formulaVersions.calculatorVersionId,
                                calculator.id,
                            ),

                            eq(
                                formulaVersions.version,
                                VERSION,
                            ),
                        ),
                    )
                    .limit(1)
            )[0];

        const formulaValues = {
            definition: {
                engine:
                    "education-calculators",

                module:
                    definition.module,

                expression:
                    definition.expression,
            },

            precision: 6,

            tolerance:
                "0.0000005000",

            verificationStatus:
                "unverified" as const,

            isActive: true,
        };

        if (!formula) {
            [formula] =
                await db
                    .insert(
                        formulaVersions,
                    )
                    .values({
                        calculatorVersionId:
                            calculator.id,

                        version:
                            VERSION,

                        ...formulaValues,
                    })
                    .returning();
        } else {
            [formula] =
                await db
                    .update(
                        formulaVersions,
                    )
                    .set({
                        ...formulaValues,

                        updatedAt:
                            new Date(),
                    })
                    .where(
                        eq(
                            formulaVersions.id,
                            formula.id,
                        ),
                    )
                    .returning();
        }

        console.log({
            tool:
                tool.slug,

            calculatorVersion:
                calculator.version,

            formulaVersion:
                formula.version,
        });
    }

    console.log(
        "Batch 9 math calculators seeded.",
    );
}