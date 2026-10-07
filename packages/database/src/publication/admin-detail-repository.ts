import {
  asc,
  and,
  desc,
  eq,
  isNotNull,
} from "drizzle-orm";

import {
  db,
} from "../client";

import {
  formulaVersions,
} from "../schema/calculator-engine";

import {
  reviews,
} from "../schema/reviews";

import {
  calculatorVersionSources,
  sources,
} from "../schema/sources";

import {
  calculatorVersions,
  toolCategories,
  tools,
} from "../schema/tools";

import {
  evaluateEditorialPublicationGate,
  type EditorialGateResult,
} from "./editorial-gate";

export type AdminPublicationDetail = {
  tool: {
    id: string;
    name: string;
    slug: string;
    status: string;
    categoryName: string | null;
    currentVersion: string | null;
    applicableYear: number | null;
    lastReviewedAt: Date | null;
  };
  calculatorVersion: {
    id: string;
    version: string;
    verificationStatus: string;
  } | null;
  formula: {
    version: string;
    verificationStatus: string;
  } | null;
  sources: Array<{
    id: string;
    title: string;
    publisher: string | null;
    verificationStatus: string;
  }>;
  latestReview: {
    id: string;
    status: string;
    reviewedAt: Date | null;
    notes: string | null;
    reviewerId: string | null;
  } | null;
  evidenceSummary: {
    totalSources: number;
    verifiedSources: number;
  };
  readiness: EditorialGateResult | null;
};

export async function getAdminPublicationDetail(
  toolId: string,
): Promise<AdminPublicationDetail | null> {
  const tool =
    (
      await db
        .select({
          id: tools.id,
          name: tools.name,
          slug: tools.slug,
          status: tools.status,
          categoryName:
            toolCategories.name,
          currentVersion:
            tools.currentVersion,
          applicableYear:
            tools.applicableYear,
          lastReviewedAt:
            tools.lastReviewedAt,
        })
        .from(tools)
        .leftJoin(
          toolCategories,
          eq(
            tools.categoryId,
            toolCategories.id,
          ),
        )
        .where(eq(tools.id, toolId))
        .limit(1)
    )[0];

  if (!tool) return null;

  if (!tool.currentVersion) {
    return {
      tool,
      calculatorVersion: null,
      formula: null,
      sources: [],
      latestReview: null,
      evidenceSummary: {
        totalSources: 0,
        verifiedSources: 0,
      },
      readiness: null,
    };
  }

  const calculatorVersion =
    (
      await db
        .select({
          id: calculatorVersions.id,
          version:
            calculatorVersions.version,
          verificationStatus:
            calculatorVersions
              .verificationStatus,
        })
        .from(calculatorVersions)
        .where(
          and(
            eq(
              calculatorVersions.toolId,
              tool.id,
            ),
            eq(
              calculatorVersions.version,
              tool.currentVersion,
            ),
            eq(
              calculatorVersions.isActive,
              true,
            ),
          ),
        )
        .limit(1)
    )[0] ?? null;

  if (!calculatorVersion) {
    return {
      tool,
      calculatorVersion: null,
      formula: null,
      sources: [],
      latestReview: null,
      evidenceSummary: {
        totalSources: 0,
        verifiedSources: 0,
      },
      readiness: null,
    };
  }

  const formula =
    (
      await db
        .select({
          version:
            formulaVersions.version,
          verificationStatus:
            formulaVersions
              .verificationStatus,
        })
        .from(formulaVersions)
        .where(
          and(
            eq(
              formulaVersions
                .calculatorVersionId,
              calculatorVersion.id,
            ),
            eq(
              formulaVersions.isActive,
              true,
            ),
          ),
        )
        .orderBy(
          desc(
            formulaVersions.createdAt,
          ),
          desc(
            formulaVersions.id,
          ),
        )
        .limit(1)
    )[0] ?? null;

  const sourceRows =
    await db
      .select({
        id: sources.id,
        title: sources.title,
        publisher: sources.publisher,
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
        eq(
          calculatorVersionSources
            .calculatorVersionId,
          calculatorVersion.id,
        ),
      )
      .orderBy(
        asc(sources.id),
      );

  const latestReview =
    (
      await db
        .select({
          id: reviews.id,
          status: reviews.status,
          reviewedAt:
            reviews.reviewedAt,
          notes: reviews.notes,
          reviewerId:
            reviews.reviewerId,
        })
        .from(reviews)
        .where(
          and(
            eq(
              reviews.entityType,
              "calculator_version",
            ),
            eq(
              reviews.entityId,
              calculatorVersion.id,
            ),
            isNotNull(
              reviews.reviewedAt,
            ),
          ),
        )
        .orderBy(
          desc(reviews.reviewedAt),
          desc(reviews.createdAt),
          desc(reviews.id),
        )
        .limit(1)
    )[0] ?? null;

  const readiness =
    evaluateEditorialPublicationGate({
      toolStatus: tool.status,
      calculatorVerificationStatus:
        calculatorVersion
          .verificationStatus,
      formulaVerificationStatus:
        formula?.verificationStatus ??
        null,
      sourceVerificationStatuses:
        sourceRows.map(
          (source) =>
            source.verificationStatus,
        ),
      latestReviewStatus:
        latestReview?.status ?? null,
      latestReviewReviewedAt:
        latestReview?.reviewedAt ??
        null,
      requireFormula: true,
      requireVerifiedSource: true,
    });

  return {
    tool,
    calculatorVersion,
    formula,
    sources: sourceRows,
    latestReview,
    evidenceSummary: {
      totalSources:
        sourceRows.length,
      verifiedSources:
        sourceRows.filter(
          (source) =>
            source.verificationStatus ===
            "verified",
        ).length,
    },
    readiness,
  };
}
