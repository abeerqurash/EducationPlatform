import {
  and,
  eq,
} from "drizzle-orm";

import {
  db,
} from "../client";

import {
  calculatorVersions,
  toolCategories,
  tools,
} from "../schema/tools";

import {
  formulaVersions,
} from "../schema/calculator-engine";

import {
  calculatorVersionSources,
  sources,
  toolSources,
} from "../schema/sources";

const CATEGORY_SLUG =
  "test-prep";

const TOOL_SLUG =
  "act-score-calculator";

const CALCULATOR_VERSION =
  "1.0.0";

const FORMULA_VERSION =
  "1.0.0";

const ACT_SOURCES = [
  {
    title:
      "ACT Exam Sections & Structure",
    publisher:
      "ACT",
    url:
      "https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/act-exam-sections-and-structure.html",
    type:
      "official" as const,
    notes:
      "Official ACT test structure, timing, question counts, scored-item counts, and optional Science/Writing information.",
  },
  {
    title:
      "ACT Multi Scores",
    publisher:
      "ACT",
    url:
      "https://www.act.org/content/act/en/products-and-services/the-act-postsecondary-professionals/scores/multi-scores.html",
    type:
      "official" as const,
    notes:
      "Official ACT guidance for the enhanced Composite and superscore calculation using English, Math, and Reading.",
  },
  {
    title:
      "ACT Superscore FAQs",
    publisher:
      "ACT",
    url:
      "https://www.act.org/content/act/en/students-and-parents/high-school-success/testing-advice-for-the-act/superscore-faqs.html",
    type:
      "official" as const,
    notes:
      "Official ACT superscore guidance, including the 2025 calculation method and treatment of optional Science.",
  },
] as const;

async function ensureCategory() {
  let category =
    (
      await db
        .select()
        .from(
          toolCategories,
        )
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
            "Test Prep",
          slug:
            CATEGORY_SLUG,
          description:
            "Score calculators and planning tools for major exams.",
          sortOrder:
            40,
          isActive:
            true,
          isArchived:
            false,
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
            "Test Prep",
          description:
            "Score calculators and planning tools for major exams.",
          isActive:
            true,
          isArchived:
            false,
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

  return category;
}

async function ensureTool(
  categoryId: string,
) {
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

  const metadata = {
    exam:
      "ACT",
    scoringModel:
      "enhanced-act-2025-plus",
    compositeSections: [
      "english",
      "math",
      "reading",
    ],
    optionalSections: [
      "science",
    ],
    sectionScoreRange: {
      minimum: 1,
      maximum: 36,
    },
    scienceIncludedInComposite:
      false,
    rawScoreConversion:
      "form-specific-not-universal",
  };

  if (!tool) {
    [tool] =
      await db
        .insert(tools)
        .values({
          categoryId,
          name:
            "ACT Score Calculator",
          slug:
            TOOL_SLUG,
          shortDescription:
            "Calculate an Enhanced ACT Composite from English, Math, and Reading section scores.",
          description:
            "Calculate an Enhanced ACT Composite score, optional STEM score, and support current ACT superscore rules without treating Science as part of the Composite.",
          access:
            "free",
          status:
            "draft",
          currentVersion:
            CALCULATOR_VERSION,
          applicableYear:
            2026,
          isFeatured:
            false,
          metadata,
          isArchived:
            false,
        })
        .returning();
  } else {
    [tool] =
      await db
        .update(tools)
        .set({
          categoryId,
          name:
            "ACT Score Calculator",
          shortDescription:
            "Calculate an Enhanced ACT Composite from English, Math, and Reading section scores.",
          description:
            "Calculate an Enhanced ACT Composite score, optional STEM score, and support current ACT superscore rules without treating Science as part of the Composite.",
          access:
            "free",
          /*
           * Keep ACT in draft until the
           * public UI/publication batch is
           * installed and reviewed.
           */
          status:
            "draft",
          currentVersion:
            CALCULATOR_VERSION,
          applicableYear:
            2026,
          isFeatured:
            false,
          metadata,
          isArchived:
            false,
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

  return tool;
}

async function ensureCalculatorVersion(
  toolId: string,
) {
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
              calculatorVersions
                .toolId,
              toolId,
            ),
            eq(
              calculatorVersions
                .version,
              CALCULATOR_VERSION,
            ),
          ),
        )
        .limit(1)
    )[0];

  const methodology =
    "Enhanced ACT Composite = round-half-up((English + Math + Reading) / 3). Science is optional and excluded from the Composite. When Science is supplied, STEM = round-half-up((Math + Science) / 2). Raw correct-answer counts are not converted by this calculator because ACT raw-to-scaled conversions can be form-specific.";

  const configuration = {
    precision:
      0,
    roundingMode:
      "half-up",
    resultFormat:
      "integer",
    scoringModel:
      "enhanced-act-2025-plus",
    sectionScoreMinimum:
      1,
    sectionScoreMaximum:
      36,
    compositeSections: [
      "english",
      "math",
      "reading",
    ],
    scienceOptional:
      true,
    scienceIncludedInComposite:
      false,
    rawScoreConversion:
      false,
  };

  if (!calculatorVersion) {
    [calculatorVersion] =
      await db
        .insert(
          calculatorVersions,
        )
        .values({
          toolId,
          version:
            CALCULATOR_VERSION,
          applicableYear:
            2026,
          effectiveFrom:
            new Date(
              "2025-09-01T00:00:00.000Z",
            ),
          effectiveUntil:
            null,
          methodology,
          configuration,
          verificationStatus:
            "unverified",
          isActive:
            true,
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
              "2025-09-01T00:00:00.000Z",
            ),
          effectiveUntil:
            null,
          methodology,
          configuration,
          verificationStatus:
            "unverified",
          isActive:
            true,
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

  return calculatorVersion;
}

async function ensureFormulaVersion(
  calculatorVersionId: string,
) {
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
              formulaVersions
                .calculatorVersionId,
              calculatorVersionId,
            ),
            eq(
              formulaVersions
                .version,
              FORMULA_VERSION,
            ),
          ),
        )
        .limit(1)
    )[0];

  const definition = {
    engine:
      "education-calculators",
    module:
      "exams/act/enhanced-act",
    compositeExpression:
      "roundHalfUp((english + math + reading) / 3, 0)",
    stemExpression:
      "science == null ? null : roundHalfUp((math + science) / 2, 0)",
    parameters: {
      sectionMinimum:
        1,
      sectionMaximum:
        36,
      compositeSections: [
        "english",
        "math",
        "reading",
      ],
      scienceOptional:
        true,
      scienceIncludedInComposite:
        false,
    },
  };

  if (!formula) {
    [formula] =
      await db
        .insert(
          formulaVersions,
        )
        .values({
          calculatorVersionId,
          version:
            FORMULA_VERSION,
          definition,
          precision:
            0,
          tolerance:
            "0.0000000000",
          verificationStatus:
            "unverified",
          isActive:
            true,
        })
        .returning();
  } else {
    [formula] =
      await db
        .update(
          formulaVersions,
        )
        .set({
          definition,
          precision:
            0,
          tolerance:
            "0.0000000000",
          verificationStatus:
            "unverified",
          isActive:
            true,
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

  return formula;
}

async function ensureSources(
  toolId: string,
  calculatorVersionId: string,
) {
  for (
    const sourceDefinition
    of ACT_SOURCES
  ) {
    let source =
      (
        await db
          .select()
          .from(sources)
          .where(
            eq(
              sources.url,
              sourceDefinition.url,
            ),
          )
          .limit(1)
      )[0];

    if (!source) {
      [source] =
        await db
          .insert(sources)
          .values({
            title:
              sourceDefinition.title,
            publisher:
              sourceDefinition.publisher,
            url:
              sourceDefinition.url,
            type:
              sourceDefinition.type,
            /*
             * Official publisher does not
             * equal internally verified.
             * Editorial verification remains
             * a separate workflow.
             */
            verificationStatus:
              "pending",
            notes:
              sourceDefinition.notes,
          })
          .returning();
    } else {
      [source] =
        await db
          .update(sources)
          .set({
            title:
              sourceDefinition.title,
            publisher:
              sourceDefinition.publisher,
            type:
              sourceDefinition.type,
            verificationStatus:
              source.verificationStatus,
            notes:
              sourceDefinition.notes,
            updatedAt:
              new Date(),
          })
          .where(
            eq(
              sources.id,
              source.id,
            ),
          )
          .returning();
    }

    const existingToolSource =
      (
        await db
          .select()
          .from(toolSources)
          .where(
            and(
              eq(
                toolSources.toolId,
                toolId,
              ),
              eq(
                toolSources.sourceId,
                source.id,
              ),
            ),
          )
          .limit(1)
      )[0];

    if (!existingToolSource) {
      await db
        .insert(toolSources)
        .values({
          toolId,
          sourceId:
            source.id,
        });
    }

    const existingVersionSource =
      (
        await db
          .select()
          .from(
            calculatorVersionSources,
          )
          .where(
            and(
              eq(
                calculatorVersionSources
                  .calculatorVersionId,
                calculatorVersionId,
              ),
              eq(
                calculatorVersionSources
                  .sourceId,
                source.id,
              ),
            ),
          )
          .limit(1)
      )[0];

    if (!existingVersionSource) {
      await db
        .insert(
          calculatorVersionSources,
        )
        .values({
          calculatorVersionId,
          sourceId:
            source.id,
        });
    }
  }
}

export async function seedEnhancedActCalculator() {
  console.log(
    "Seeding Enhanced ACT calculator...",
  );

  const category =
    await ensureCategory();

  const tool =
    await ensureTool(
      category.id,
    );

  const calculatorVersion =
    await ensureCalculatorVersion(
      tool.id,
    );

  const formula =
    await ensureFormulaVersion(
      calculatorVersion.id,
    );

  await ensureSources(
    tool.id,
    calculatorVersion.id,
  );

  console.log(
    "Enhanced ACT calculator seeded.",
  );

  console.log({
    category:
      category.slug,
    tool:
      tool.slug,
    toolStatus:
      tool.status,
    calculatorVersion:
      calculatorVersion.version,
    formulaVersion:
      formula.version,
    sourceVerification:
      "preserved-existing-or-pending",
  });
}
