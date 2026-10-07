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

type SeedDefinition = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  methodology: string;
  formulaExpression: string;
  module: string;
  keywords: string[];
  featureFlags:
    Record<
      string,
      boolean
    >;
};

const VERSION = "1.0.0";

const definitions:
  SeedDefinition[] = [
  {
    slug:
      "grade-calculator",

    name:
      "Grade Calculator",

    shortDescription:
      "Calculate your overall percentage from earned and possible points.",

    description:
      "Free point-based grade calculator for assignments, quizzes, exams and other graded work.",

    methodology:
      "Total earned points are divided by total possible points and multiplied by 100.",

    formulaExpression:
      "sum(earnedPoints) / sum(possiblePoints) * 100",

    module: "grade",

    keywords: [
      "grade calculator",
      "percentage grade",
      "assignment grade",
      "points calculator",
    ],

    featureFlags: {
      totalPoints: true,
      letterGrade:
        true,
      weightedCategories:
        false,
    },
  },

  {
    slug:
      "final-grade-calculator",

    name:
      "Final Grade Calculator",

    shortDescription:
      "Calculate the score needed on a remaining final assessment to reach a target course grade.",

    description:
      "Free final grade target calculator using current grade, completed course weight and desired overall grade.",

    methodology:
      "The current grade is multiplied by the completed course fraction. The remaining contribution required to reach the target is divided by the remaining course fraction.",

    formulaExpression:
      "(desiredGrade - currentGrade * (completedWeight / 100)) / ((100 - completedWeight) / 100)",

    module:
      "final-grade",

    keywords: [
      "final grade calculator",
      "final exam grade",
      "grade needed",
      "target grade",
    ],

    featureFlags: {
      weightedTarget:
        true,

      impossibleTargetDetection:
        true,
    },
  },
];

async function getOrCreateCategory() {
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
            "grades",
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
            "Grade Calculators",

          description:
            "Grade, percentage and final-grade calculation tools.",

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
          "Grade Calculators",

        slug: "grades",

        description:
          "Grade, percentage and final-grade calculation tools.",

        sortOrder: 20,

        isActive: true,
        isArchived: false,
      })
      .returning();

  return created;
}

async function seedDefinition(
  categoryId: string,
  definition:
    SeedDefinition,
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
    categoryId,

    name:
      definition.name,

    shortDescription:
      definition.shortDescription,

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

    isFeatured: true,

    isArchived: false,

    metadata: {
      keywords:
        definition.keywords,

      estimatedMinutes: 2,

      featuredLabel:
        "Popular",
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

  let calculatorVersion =
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
      precision: 3,

      roundingMode:
        "half-up",

      resultFormat:
        "percentage",

      featureFlags:
        definition.featureFlags,
    },

    verificationStatus:
      "unverified" as const,

    isActive: true,
  };

  if (!calculatorVersion) {
    [calculatorVersion] =
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
    [calculatorVersion] =
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
            calculatorVersion.id,
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
              calculatorVersion.id,
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
        definition.formulaExpression,
    },

    precision: 3,

    tolerance:
      "0.0005000000",

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
            calculatorVersion.id,

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
    tool:
      tool.slug,

    calculatorVersion:
      calculatorVersion.version,

    formulaVersion:
      formula.version,
  });
}

export async function seedGradeCalculators() {
  console.log(
    "Seeding grade calculators...",
  );

  const category =
    await getOrCreateCategory();

  for (
    const definition
    of definitions
  ) {
    await seedDefinition(
      category.id,
      definition,
    );
  }

  console.log(
    "Grade calculators seeded.",
  );
}