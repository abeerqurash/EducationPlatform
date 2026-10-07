import {
  and,
  desc,
  eq,
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
  tools,
} from "../schema/tools";

import type {
  PublicationWorkflowState,
} from "./workflow";

export type ResolvedPublicationState = {
  toolId: string;
  calculatorVersionId: string;
  calculatorVersion: string;

  state:
    PublicationWorkflowState;
};

export type ResolvePublicationStateOptions = {
  /**
   * Dataset-driven calculators such as SAT estimators can opt out of
   * formula requirements. This is server-owned configuration.
   */
  requireFormula?: boolean;

  requireVerifiedSource?: boolean;
};

export async function resolvePublicationState(
  toolId: string,
  options:
    ResolvePublicationStateOptions = {},
): Promise<
  ResolvedPublicationState
> {
  const tool =
    (
      await db
        .select({
          id:
            tools.id,
          status:
            tools.status,
          currentVersion:
            tools.currentVersion,
        })
        .from(tools)
        .where(
          eq(
            tools.id,
            toolId,
          ),
        )
        .limit(1)
    )[0];

  if (!tool) {
    throw new Error(
      "Publication target tool was not found.",
    );
  }

  if (!tool.currentVersion) {
    throw new Error(
      "Publication target tool has no current calculator version.",
    );
  }

  const calculatorVersion =
    (
      await db
        .select({
          id:
            calculatorVersions.id,

          version:
            calculatorVersions.version,

          verificationStatus:
            calculatorVersions
              .verificationStatus,

          isActive:
            calculatorVersions
              .isActive,
        })
        .from(
          calculatorVersions,
        )
        .where(
          and(
            eq(
              calculatorVersions
                .toolId,
              tool.id,
            ),

            eq(
              calculatorVersions
                .version,
              tool.currentVersion,
            ),

            eq(
              calculatorVersions
                .isActive,
              true,
            ),
          ),
        )
        .limit(1)
    )[0];

  if (!calculatorVersion) {
    throw new Error(
      "The tool currentVersion does not resolve to an active calculator version.",
    );
  }

  const formula =
    (
      await db
        .select({
          verificationStatus:
            formulaVersions
              .verificationStatus,
        })
        .from(
          formulaVersions,
        )
        .where(
          and(
            eq(
              formulaVersions
                .calculatorVersionId,
              calculatorVersion.id,
            ),

            eq(
              formulaVersions
                .isActive,
              true,
            ),
          ),
        )
        .orderBy(
          desc(
            formulaVersions
              .createdAt,
          ),
        )
        .limit(1)
    )[0] ?? null;

  const sourceRows =
    await db
      .select({
        verificationStatus:
          sources
            .verificationStatus,
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
      );

  const latestReview =
    (
      await db
        .select({
          status:
            reviews.status,

          reviewedAt:
            reviews.reviewedAt,
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
          ),
        )
        .orderBy(
          desc(
            reviews.createdAt,
          ),
        )
        .limit(1)
    )[0] ?? null;

  return {
    toolId:
      tool.id,

    calculatorVersionId:
      calculatorVersion.id,

    calculatorVersion:
      calculatorVersion.version,

    state: {
      toolStatus:
        tool.status,

      calculatorVerificationStatus:
        calculatorVersion
          .verificationStatus,

      formulaVerificationStatus:
        formula
          ?.verificationStatus ??
        null,

      sourceVerificationStatuses:
        sourceRows.map(
          (row) =>
            row.verificationStatus,
        ),

      latestReviewStatus:
        latestReview?.status ??
        null,

      latestReviewReviewedAt:
        latestReview
          ?.reviewedAt ??
        null,

      requireFormula:
        options.requireFormula ??
        true,

      requireVerifiedSource:
        options.requireVerifiedSource ??
        true,
    },
  };
}
