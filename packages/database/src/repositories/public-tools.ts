import {
  and,
  desc,
  eq,
} from "drizzle-orm";

import { db } from "../client";

import {
  calculatorVersions,
  toolCategories,
  tools,
  type CalculatorConfiguration,
} from "../schema/tools";

import {
  formulaVersions,
  type FormulaDefinition,
} from "../schema/calculator-engine";

import {
  calculatorVersionSources,
  sources,
} from "../schema/sources";

import {
  reviews,
} from "../schema/reviews";

import {
  users,
} from "../schema/users";

export type PublicCalculatorSource = {
  id: string;
  title: string;
  publisher: string | null;
  url: string;
  type: string;
  verificationStatus: string;
};

export type PublicCalculatorReview = {
  status: string;
  reviewedAt: Date | null;
  reviewerName: string | null;
};

export type PublicCalculatorRecord = {
  tool: {
    id: string;
    name: string;
    slug: string;

    shortDescription:
      | string
      | null;

    description:
      | string
      | null;

    access: string;
    status: string;

    currentVersion:
      | string
      | null;

    applicableYear:
      | number
      | null;

    lastReviewedAt:
      | Date
      | null;
  };

  category: {
    id: string;
    name: string;
    slug: string;
  };

  calculatorVersion: {
    id: string;
    version: string;

    applicableYear:
      | number
      | null;

    effectiveFrom:
      | Date
      | null;

    effectiveUntil:
      | Date
      | null;

    methodology:
      | string
      | null;

    configuration:
      CalculatorConfiguration | null;

    verificationStatus:
      string;

    isActive:
      boolean;
  };

  formulaVersion: {
    id: string;
    version: string;

    definition:
      FormulaDefinition;

    precision:
      | number
      | null;

    tolerance:
      | string
      | null;

    verificationStatus:
      string;

    isActive:
      boolean;
  } | null;

  sources:
    PublicCalculatorSource[];

  latestReview:
    PublicCalculatorReview | null;
};

export async function getPublicCalculator(
  categorySlug: string,
  toolSlug: string,
): Promise<
  PublicCalculatorRecord | null
> {
  const rows =
    await db
      .select({
        toolId:
          tools.id,

        toolName:
          tools.name,

        toolSlug:
          tools.slug,

        toolShortDescription:
          tools.shortDescription,

        toolDescription:
          tools.description,

        toolAccess:
          tools.access,

        toolStatus:
          tools.status,

        toolCurrentVersion:
          tools.currentVersion,

        toolApplicableYear:
          tools.applicableYear,

        toolLastReviewedAt:
          tools.lastReviewedAt,

        categoryId:
          toolCategories.id,

        categoryName:
          toolCategories.name,

        categorySlug:
          toolCategories.slug,

        calculatorVersionId:
          calculatorVersions.id,

        calculatorVersion:
          calculatorVersions.version,

        calculatorApplicableYear:
          calculatorVersions.applicableYear,

        calculatorEffectiveFrom:
          calculatorVersions.effectiveFrom,

        calculatorEffectiveUntil:
          calculatorVersions.effectiveUntil,

        calculatorMethodology:
          calculatorVersions.methodology,

        calculatorConfiguration:
          calculatorVersions.configuration,

        calculatorVerificationStatus:
          calculatorVersions.verificationStatus,

        calculatorIsActive:
          calculatorVersions.isActive,

        formulaVersionId:
          formulaVersions.id,

        formulaVersion:
          formulaVersions.version,

        formulaDefinition:
          formulaVersions.definition,

        formulaPrecision:
          formulaVersions.precision,

        formulaTolerance:
          formulaVersions.tolerance,

        formulaVerificationStatus:
          formulaVersions.verificationStatus,

        formulaIsActive:
          formulaVersions.isActive,
      })
      .from(tools)
      .innerJoin(
        toolCategories,
        eq(
          tools.categoryId,
          toolCategories.id,
        ),
      )
      .innerJoin(
        calculatorVersions,
        eq(
          calculatorVersions.toolId,
          tools.id,
        ),
      )
      .leftJoin(
        formulaVersions,
        and(
          eq(
            formulaVersions
              .calculatorVersionId,
            calculatorVersions.id,
          ),

          eq(
            formulaVersions.isActive,
            true,
          ),
        ),
      )
      .where(
        and(
          eq(
            tools.slug,
            toolSlug,
          ),

          eq(
            toolCategories.slug,
            categorySlug,
          ),

          eq(
            tools.status,
            "published",
          ),

          eq(
            tools.isArchived,
            false,
          ),

          eq(
            toolCategories.isActive,
            true,
          ),

          eq(
            toolCategories.isArchived,
            false,
          ),

          eq(
            calculatorVersions.isActive,
            true,
          ),
        ),
      )
      .limit(1);

  const row =
    rows[0];

  if (!row) {
    return null;
  }

  /*
   * PUBLIC SOURCE POLICY
   *
   * Only internally verified source
   * records are returned to the public
   * calculator layer.
   *
   * "official" source type and
   * "verified" editorial status are
   * intentionally separate concepts.
   */
  const sourceRows =
    await db
      .select({
        id:
          sources.id,

        title:
          sources.title,

        publisher:
          sources.publisher,

        url:
          sources.url,

        type:
          sources.type,

        verificationStatus:
          sources.verificationStatus,
      })
      .from(
        calculatorVersionSources,
      )
      .innerJoin(
        sources,
        eq(
          calculatorVersionSources
            .sourceId,
          sources.id,
        ),
      )
      .where(
        and(
          eq(
            calculatorVersionSources
              .calculatorVersionId,
            row.calculatorVersionId,
          ),

          eq(
            sources.verificationStatus,
            "verified",
          ),
        ),
      );

  /*
   * PUBLIC REVIEW POLICY
   *
   * Publication/readiness should use
   * the latest APPROVED review.
   *
   * A newer pending/rejected review
   * must not replace a previously
   * approved editorial review.
   */
  const reviewRows =
    await db
      .select({
        status:
          reviews.status,

        reviewedAt:
          reviews.reviewedAt,

        reviewerName:
          users.name,
      })
      .from(reviews)
      .leftJoin(
        users,
        eq(
          reviews.reviewerId,
          users.id,
        ),
      )
      .where(
        and(
          eq(
            reviews.entityType,
            "calculator_version",
          ),

          eq(
            reviews.entityId,
            row.calculatorVersionId,
          ),

          eq(
            reviews.status,
            "approved",
          ),
        ),
      )
      .orderBy(
        desc(
          reviews.reviewedAt,
        ),

        /*
         * Deterministic fallback when
         * reviewedAt values happen to
         * be identical.
         */
        desc(
          reviews.createdAt,
        ),
      )
      .limit(1);

  const latestReview =
    reviewRows[0] ??
    null;

  return {
    tool: {
      id:
        row.toolId,

      name:
        row.toolName,

      slug:
        row.toolSlug,

      shortDescription:
        row.toolShortDescription,

      description:
        row.toolDescription,

      access:
        row.toolAccess,

      status:
        row.toolStatus,

      currentVersion:
        row.toolCurrentVersion,

      applicableYear:
        row.toolApplicableYear,

      lastReviewedAt:
        row.toolLastReviewedAt,
    },

    category: {
      id:
        row.categoryId,

      name:
        row.categoryName,

      slug:
        row.categorySlug,
    },

    calculatorVersion: {
      id:
        row.calculatorVersionId,

      version:
        row.calculatorVersion,

      applicableYear:
        row.calculatorApplicableYear,

      effectiveFrom:
        row.calculatorEffectiveFrom,

      effectiveUntil:
        row.calculatorEffectiveUntil,

      methodology:
        row.calculatorMethodology,

      configuration:
        row.calculatorConfiguration,

      verificationStatus:
        row.calculatorVerificationStatus,

      isActive:
        row.calculatorIsActive,
    },

    formulaVersion:
      row.formulaVersionId &&
      row.formulaVersion &&
      row.formulaDefinition
        ? {
            id:
              row.formulaVersionId,

            version:
              row.formulaVersion,

            definition:
              row.formulaDefinition,

            precision:
              row.formulaPrecision,

            tolerance:
              row.formulaTolerance,

            verificationStatus:
              row
                .formulaVerificationStatus ??
              "unverified",

            isActive:
              row.formulaIsActive ??
              false,
          }
        : null,

    sources:
      sourceRows,

    latestReview,
  };
}