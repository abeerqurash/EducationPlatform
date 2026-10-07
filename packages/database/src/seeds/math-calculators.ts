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
      "percentage-calculator",

    name:
      "Percentage Calculator",

    description:
      "Calculate what percentage one number is of another.",

    methodology:
      "The part is divided by the whole and multiplied by 100.",

    module:
      "percentage",

    expression:
      "(part / whole) * 100",

    keywords: [
      "percentage calculator",
      "percent calculator",
      "what percent",
    ],
  },

  {
    slug:
      "average-calculator",

    name:
      "Average Calculator",

    description:
      "Calculate the arithmetic mean of a set of numbers.",

    methodology:
      "All values are summed and divided by the number of values.",

    module:
      "average",

    expression:
      "sum(values) / count(values)",

    keywords: [
      "average calculator",
      "mean calculator",
      "arithmetic mean",
    ],
  },
] as const;

async function category() {
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

  if (existing) {
    const [updated] =
      await db
        .update(
          toolCategories,
        )
        .set({
          name:
            "Math Calculators",

          description:
            "General mathematics and numerical calculation tools.",

          isActive: true,
          isArchived: false,

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            toolCategories.id,
            existing.id,
          ),
        )
        .returning();

    return updated;
  }

  const [created] =
    await db
      .insert(
        toolCategories,
      )
      .values({
        name:
          "Math Calculators",

        slug: "math",

        description:
          "General mathematics and numerical calculation tools.",

        sortOrder: 30,

        isActive: true,
        isArchived: false,
      })
      .returning();

  return created;
}

export async function seedMathCalculators() {
  console.log(
    "Seeding math calculators...",
  );

  const toolCategory =
    await category();

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
        toolCategory.id,

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
          [...definition.keywords],

        estimatedMinutes: 1,
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

      effectiveUntil: null,

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
            toolId: tool.id,
            version: VERSION,

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

            version: VERSION,

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
      tool: tool.slug,

      calculatorVersion:
        calculator.version,

      formulaVersion:
        formula.version,
    });
  }

  console.log(
    "Math calculators seeded.",
  );
}