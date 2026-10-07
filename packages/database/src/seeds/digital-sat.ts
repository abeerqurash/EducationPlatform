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
  calculatorDatasets,
  datasets,
  datasetVersions,
} from "../schema/calculator-engine";

import {
  calculatorVersionSources,
  sources,
  toolSources,
} from "../schema/sources";

const VERSION = "1.0.0";

const TOOL_SLUG =
  "digital-sat-score-calculator";

const DATASET_KEY =
  "digital-sat-general-estimator";

const EFFECTIVE_FROM =
  new Date(
    "2026-10-07T00:00:00.000Z",
  );

const SOURCE_DEFINITIONS = [
  {
    title:
      "SAT Test Structure",

    publisher:
      "College Board",

    url:
      "https://satsuite.collegeboard.org/sat/whats-on-the-test/structure",

    type:
      "official" as const,

    notes:
      "Official SAT structure reference used to document section and module structure. It is not an exact raw-score conversion table.",
  },

  {
    title:
      "How SAT Scores Are Calculated",

    publisher:
      "College Board",

    url:
      "https://satsuite.collegeboard.org/scores/what-scores-mean/how-scores-calculated",

    type:
      "official" as const,

    notes:
      "Official SAT scoring methodology reference. Used to support the limitation that correct-answer totals alone do not reconstruct an official Digital SAT score.",
  },

  {
    title:
      "SAT Score Structure",

    publisher:
      "College Board",

    url:
      "https://satsuite.collegeboard.org/k12-educators/about/understand-scores-benchmarks/score-structure",

    type:
      "official" as const,

    notes:
      "Official reference for SAT section and total score scales.",
  },
] as const;

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

function roundToTen(
  value: number,
) {
  return (
    Math.round(value / 10) *
    10
  );
}

function createEstimatedRows(
  maximumRawScore: number,
) {
  return Array.from(
    {
      length:
        maximumRawScore + 1,
    },

    (_, rawScore) => {
      const ratio =
        rawScore /
        maximumRawScore;

      const center =
        200 +
        ratio * 600;

      let min =
        roundToTen(
          center - 40,
        );

      let max =
        roundToTen(
          center + 40,
        );

      min = clamp(
        min,
        200,
        800,
      );

      max = clamp(
        max,
        200,
        800,
      );

      if (rawScore === 0) {
        min = 200;
        max = 240;
      }

      if (
        rawScore ===
        maximumRawScore
      ) {
        min = 760;
        max = 800;
      }

      return {
        rawScore,

        score: {
          min,
          max,
        },
      };
    },
  );
}

async function ensureCategory() {
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
            "test-prep",
          ),
        )
        .limit(1)
    )[0];

  const values = {
    name:
      "Test Prep",

    description:
      "Score calculators, exam preparation tools and test-planning resources.",

    isActive: true,

    isArchived: false,

    updatedAt:
      new Date(),
  };

  if (existing) {
    const [updated] =
      await db
        .update(
          toolCategories,
        )
        .set(values)
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
        slug:
          "test-prep",

        name:
          "Test Prep",

        description:
          "Score calculators, exam preparation tools and test-planning resources.",

        sortOrder: 40,

        isActive: true,

        isArchived: false,
      })
      .returning();

  return created;
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

  const values = {
    categoryId,

    name:
      "Digital SAT Score Calculator",

    shortDescription:
      "Estimate Digital SAT Reading and Writing, Math and total score ranges from module-level correct answers.",

    description:
      "Estimate Digital SAT section and total score ranges using a transparent estimation model. Results are estimates and are not official College Board scores.",

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
      keywords: [
        "digital sat score calculator",
        "sat score calculator",
        "sat score estimator",
        "sat calculator",
        "digital sat calculator",
      ],

      estimatedMinutes: 2,

      featuredLabel:
        "SAT",
    },

    updatedAt:
      new Date(),
  };

  if (!tool) {
    [tool] =
      await db
        .insert(tools)
        .values({
          slug:
            TOOL_SLUG,

          ...values,
        })
        .returning();
  } else {
    [tool] =
      await db
        .update(tools)
        .set(values)
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
              calculatorVersions
                .toolId,
              toolId,
            ),

            eq(
              calculatorVersions
                .version,
              VERSION,
            ),
          ),
        )
        .limit(1)
    )[0];

  const values = {
    applicableYear:
      2026,

    effectiveFrom:
      EFFECTIVE_FROM,

    effectiveUntil:
      null,

    methodology:
      "Combines correct-answer counts for the two Reading and Writing modules and the two Math modules, then maps each section total through a transparent estimation dataset. The result is an estimated score range rather than an official SAT score because official Digital SAT scoring depends on adaptive routing, question characteristics and the specific questions administered.",

    configuration: {
      precision: 0,

      resultFormat:
        "score-range",

      featureFlags: {
        adaptiveDisclaimer:
          true,

        rangeOutput:
          true,

        officialScoreClaim:
          false,
      },
    },

    /*
     * Important:
     *
     * The calculator is intentionally
     * unverified because its general
     * score conversion is an internal
     * estimator rather than an official
     * College Board conversion table.
     */
    verificationStatus:
      "unverified" as const,

    isActive: true,

    updatedAt:
      new Date(),
  };

  if (!calculator) {
    [calculator] =
      await db
        .insert(
          calculatorVersions,
        )
        .values({
          toolId,

          version:
            VERSION,

          ...values,
        })
        .returning();
  } else {
    [calculator] =
      await db
        .update(
          calculatorVersions,
        )
        .set(values)
        .where(
          eq(
            calculatorVersions.id,
            calculator.id,
          ),
        )
        .returning();
  }

  return calculator;
}

async function ensureDataset() {
  let dataset =
    (
      await db
        .select()
        .from(datasets)
        .where(
          eq(
            datasets.key,
            DATASET_KEY,
          ),
        )
        .limit(1)
    )[0];

  const values = {
    name:
      "Digital SAT General Estimation Dataset",

    description:
      "Internal transparent score-range estimation model for the Digital SAT. This dataset is not an official College Board raw-score conversion table.",

    updatedAt:
      new Date(),
  };

  if (!dataset) {
    [dataset] =
      await db
        .insert(datasets)
        .values({
          key:
            DATASET_KEY,

          ...values,
        })
        .returning();
  } else {
    [dataset] =
      await db
        .update(datasets)
        .set(values)
        .where(
          eq(
            datasets.id,
            dataset.id,
          ),
        )
        .returning();
  }

  return dataset;
}

async function ensureDatasetVersion(
  datasetId: string,
) {
  let version =
    (
      await db
        .select()
        .from(
          datasetVersions,
        )
        .where(
          and(
            eq(
              datasetVersions
                .datasetId,
              datasetId,
            ),

            eq(
              datasetVersions
                .version,
              VERSION,
            ),
          ),
        )
        .limit(1)
    )[0];

  const values = {
    applicableYear:
      2026,

    effectiveFrom:
      EFFECTIVE_FROM,

    effectiveUntil:
      null,

    payload: {
      entries: [
        {
          sectionId:
            "reading-writing",

          maximumRawScore:
            54,

          rows:
            createEstimatedRows(
              54,
            ),
        },

        {
          sectionId:
            "math",

          maximumRawScore:
            44,

          rows:
            createEstimatedRows(
              44,
            ),
        },
      ],

      mappings: {
        model:
          "linear-range-estimator",

        sourceType:
          "estimated",

        officialScore:
          false,

        sectionScoreMin:
          200,

        sectionScoreMax:
          800,

        totalScoreMin:
          400,

        totalScoreMax:
          1600,

        uncertainty:
          "Correct-answer totals alone cannot reconstruct an official adaptive Digital SAT score.",

        engineDatasetId:
          DATASET_KEY,

        engineDatasetVersion:
          VERSION,
      },
    },

    /*
     * Do not change this to verified.
     *
     * The College Board references are
     * official sources, but this score
     * conversion dataset is our own
     * estimation model.
     */
    verificationStatus:
      "unverified" as const,

    isActive: true,

    updatedAt:
      new Date(),
  };

  if (!version) {
    [version] =
      await db
        .insert(
          datasetVersions,
        )
        .values({
          datasetId,

          version:
            VERSION,

          ...values,
        })
        .returning();
  } else {
    [version] =
      await db
        .update(
          datasetVersions,
        )
        .set(values)
        .where(
          eq(
            datasetVersions.id,
            version.id,
          ),
        )
        .returning();
  }

  return version;
}

async function ensureCalculatorDataset(
  calculatorVersionId: string,
  datasetVersionId: string,
) {
  const existing =
    (
      await db
        .select()
        .from(
          calculatorDatasets,
        )
        .where(
          and(
            eq(
              calculatorDatasets
                .calculatorVersionId,
              calculatorVersionId,
            ),

            eq(
              calculatorDatasets
                .datasetVersionId,
              datasetVersionId,
            ),
          ),
        )
        .limit(1)
    )[0];

  if (existing) {
    await db
      .update(
        calculatorDatasets,
      )
      .set({
        purpose:
          "Digital SAT general score-range estimation",

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          calculatorDatasets.id,
          existing.id,
        ),
      );

    return;
  }

  await db
    .insert(
      calculatorDatasets,
    )
    .values({
      calculatorVersionId,

      datasetVersionId,

      purpose:
        "Digital SAT general score-range estimation",
    });
}

async function ensureSource(
  definition:
    (typeof SOURCE_DEFINITIONS)[number],
) {
  let source =
    (
      await db
        .select()
        .from(sources)
        .where(
          eq(
            sources.url,
            definition.url,
          ),
        )
        .limit(1)
    )[0];

  const values = {
    title:
      definition.title,

    publisher:
      definition.publisher,

    type:
      definition.type,

    /*
     * These are official College Board
     * pages, but we are not marking
     * database verification complete
     * automatically during a seed.
     *
     * Admin/editor verification can
     * promote them later.
     */
    verificationStatus:
      "pending" as const,

    notes:
      definition.notes,

    updatedAt:
      new Date(),
  };

  if (!source) {
    [source] =
      await db
        .insert(sources)
        .values({
          url:
            definition.url,

          ...values,
        })
        .returning();
  } else {
    [source] =
      await db
        .update(sources)
        .set(values)
        .where(
          eq(
            sources.id,
            source.id,
          ),
        )
        .returning();
  }

  return source;
}

async function ensureToolSource(
  toolId: string,
  sourceId: string,
) {
  const existing =
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
              sourceId,
            ),
          ),
        )
        .limit(1)
    )[0];

  if (existing) {
    return;
  }

  await db
    .insert(toolSources)
    .values({
      toolId,
      sourceId,
    });
}

async function ensureCalculatorSource(
  calculatorVersionId: string,
  sourceId: string,
) {
  const existing =
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
              sourceId,
            ),
          ),
        )
        .limit(1)
    )[0];

  if (existing) {
    return;
  }

  await db
    .insert(
      calculatorVersionSources,
    )
    .values({
      calculatorVersionId,
      sourceId,
    });
}

export async function seedDigitalSat() {
  console.log(
    "Seeding Digital SAT calculator...",
  );

  const category =
    await ensureCategory();

  const tool =
    await ensureTool(
      category.id,
    );

  const calculator =
    await ensureCalculatorVersion(
      tool.id,
    );

  const dataset =
    await ensureDataset();

  const datasetVersion =
    await ensureDatasetVersion(
      dataset.id,
    );

  await ensureCalculatorDataset(
    calculator.id,
    datasetVersion.id,
  );

  for (
    const definition
    of SOURCE_DEFINITIONS
  ) {
    const source =
      await ensureSource(
        definition,
      );

    await ensureToolSource(
      tool.id,
      source.id,
    );

    await ensureCalculatorSource(
      calculator.id,
      source.id,
    );
  }

  console.log({
    tool:
      tool.slug,

    calculatorVersion:
      calculator.version,

    dataset:
      dataset.key,

    datasetVersion:
      datasetVersion.version,

    sources:
      SOURCE_DEFINITIONS.length,
  });

  console.log(
    "Digital SAT calculator seeded.",
  );
}