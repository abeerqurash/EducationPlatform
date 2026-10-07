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

const CATEGORY_SLUG = "gpa";
const TOOL_SLUG =
  "gpa-calculator";

const CALCULATOR_VERSION =
  "1.0.0";

const FORMULA_VERSION =
  "1.0.0";

export async function seedGPACalculator() {
  console.log(
    "Seeding GPA calculator...",
  );

  let category =
    (
      await db
        .select()
        .from(toolCategories)
        .where(
          eq(
            toolCategories.slug,
            CATEGORY_SLUG,
          ),
        )
        .limit(1)
    )[0];

  if (!category) {
    [category] =
      await db
        .insert(
          toolCategories,
        )
        .values({
          name:
            "GPA Calculators",

          slug:
            CATEGORY_SLUG,

          description:
            "GPA and academic grade-point calculation tools.",

          sortOrder: 10,
          isActive: true,
          isArchived: false,
        })
        .returning();
  } else {
    [category] =
      await db
        .update(
          toolCategories,
        )
        .set({
          name:
            "GPA Calculators",

          description:
            "GPA and academic grade-point calculation tools.",

          isActive: true,
          isArchived: false,

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            toolCategories.id,
            category.id,
          ),
        )
        .returning();
  }

  let tool =
    (
      await db
        .select()
        .from(tools)
        .where(
          eq(
            tools.slug,
            TOOL_SLUG,
          ),
        )
        .limit(1)
    )[0];

  if (!tool) {
    [tool] =
      await db
        .insert(tools)
        .values({
          categoryId:
            category.id,

          name:
            "GPA Calculator",

          slug:
            TOOL_SLUG,

          shortDescription:
            "Calculate your credit-weighted GPA from course credit hours and grade points.",

          description:
            "Free credit-weighted GPA calculator using course credits and grade points on a 4.0 scale.",

          access: "free",

          status:
            "published",

          currentVersion:
            CALCULATOR_VERSION,

          applicableYear:
            2026,

          isFeatured: true,

          isArchived: false,

          metadata: {
            keywords: [
              "gpa calculator",
              "grade point average",
              "college gpa",
              "credit weighted gpa",
            ],

            estimatedMinutes: 2,

            featuredLabel:
              "Popular",
          },
        })
        .returning();
  } else {
    [tool] =
      await db
        .update(tools)
        .set({
          categoryId:
            category.id,

          name:
            "GPA Calculator",

          shortDescription:
            "Calculate your credit-weighted GPA from course credit hours and grade points.",

          description:
            "Free credit-weighted GPA calculator using course credits and grade points on a 4.0 scale.",

          access: "free",

          status:
            "published",

          currentVersion:
            CALCULATOR_VERSION,

          applicableYear:
            2026,

          isFeatured: true,

          isArchived: false,

          metadata: {
            keywords: [
              "gpa calculator",
              "grade point average",
              "college gpa",
              "credit weighted gpa",
            ],

            estimatedMinutes: 2,

            featuredLabel:
              "Popular",
          },

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
              CALCULATOR_VERSION,
            ),
          ),
        )
        .limit(1)
    )[0];

  const methodology =
    "Credit-weighted GPA is calculated by multiplying each course grade-point value by its credit value, summing those quality points, and dividing the total quality points by total credits.";

  if (!calculatorVersion) {
    [calculatorVersion] =
      await db
        .insert(
          calculatorVersions,
        )
        .values({
          toolId: tool.id,

          version:
            CALCULATOR_VERSION,

          applicableYear:
            2026,

          effectiveFrom:
            new Date(
              "2026-10-07T00:00:00.000Z",
            ),

          methodology,

          configuration: {
            precision: 3,

            roundingMode:
              "half-up",

            resultFormat:
              "decimal",

            featureFlags: {
              creditWeighted:
                true,

              honorsWeighting:
                false,

              customScale:
                false,
            },
          },

          /*
           * The implementation has automated
           * regression tests, but it has not
           * yet received an independent
           * human/authoritative review.
           */
          verificationStatus:
            "unverified",

          isActive: true,
        })
        .returning();
  } else {
    [calculatorVersion] =
      await db
        .update(
          calculatorVersions,
        )
        .set({
          applicableYear:
            2026,

          effectiveFrom:
            new Date(
              "2026-10-07T00:00:00.000Z",
            ),

          effectiveUntil:
            null,

          methodology,

          configuration: {
            precision: 3,

            roundingMode:
              "half-up",

            resultFormat:
              "decimal",

            featureFlags: {
              creditWeighted:
                true,

              honorsWeighting:
                false,

              customScale:
                false,
            },
          },

          verificationStatus:
            "unverified",

          isActive: true,

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
              FORMULA_VERSION,
            ),
          ),
        )
        .limit(1)
    )[0];

  const formulaDefinition = {
    engine:
      "education-calculators",

    module: "gpa",

    expression:
      "sum(credits * gradePoints) / sum(credits)",

    parameters: {
      minimumGradePoints: 0,
      maximumGradePoints: 4,
      maximumCourses: 100,
      maximumCreditsPerCourse:
        100,
      maximumTotalCredits:
        10000,
    },
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

          version:
            FORMULA_VERSION,

          definition:
            formulaDefinition,

          precision: 3,

          tolerance:
            "0.0005000000",

          verificationStatus:
            "unverified",

          isActive: true,
        })
        .returning();
  } else {
    [formula] =
      await db
        .update(
          formulaVersions,
        )
        .set({
          definition:
            formulaDefinition,

          precision: 3,

          tolerance:
            "0.0005000000",

          verificationStatus:
            "unverified",

          isActive: true,

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

  console.log(
    "GPA calculator seeded.",
  );

  console.log({
    category:
      category.slug,

    tool:
      tool.slug,

    calculatorVersion:
      calculatorVersion.version,

    formulaVersion:
      formula.version,
  });
}