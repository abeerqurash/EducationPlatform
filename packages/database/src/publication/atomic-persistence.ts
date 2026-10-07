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
  auditLogs,
} from "../schema/audit";

import {
  changeHistory,
} from "../schema/change-history";

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

import {
  createPublicationAuditPlan,
} from "./audit-plan";

import {
  planPublicationWorkflow,
  type PublicationWorkflowAction,
  type PublicationWorkflowState,
} from "./workflow";

export type PersistTrustedPublicationTransitionInput = {
  toolId: string;
  actorUserId: string;
  action: PublicationWorkflowAction;
  reason?: string;
};

export type PersistTrustedPublicationTransitionResult =
  | {
      success: true;
      toolId: string;
      fromStatus:
        PublicationWorkflowState["toolStatus"];
      toStatus:
        PublicationWorkflowState["toolStatus"];
      lastReviewedAt:
        Date | null;
    }
  | {
      success: false;
      toolId: string;
      issues: ReturnType<
        typeof planPublicationWorkflow
      >["issues"];
    };

export class PublicationTargetNotFoundError extends Error {
  constructor() {
    super(
      "Publication target tool was not found.",
    );
    this.name =
      "PublicationTargetNotFoundError";
  }
}

export class PublicationStateConflictError extends Error {
  constructor() {
    super(
      "Publication state changed before commit.",
    );
    this.name =
      "PublicationStateConflictError";
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function assertUuidLike(
  value: string,
  field: string,
) {
  if (!UUID_PATTERN.test(value)) {
    throw new Error(
      `${field} must be a valid UUID.`,
    );
  }
}

/**
 * Resolves the editorial state and commits the transition inside the
 * same PostgreSQL transaction.
 *
 * This closes the resolve-then-write time-of-check/time-of-use gap:
 * the workflow plan is based on database state read by this transaction,
 * and the final UPDATE also predicates on the expected status.
 *
 * Publication policy is intentionally strict here. Formula and verified
 * source requirements cannot be weakened by request input.
 */
export async function persistTrustedPublicationTransition(
  input:
    PersistTrustedPublicationTransitionInput,
): Promise<
  PersistTrustedPublicationTransitionResult
> {
  assertUuidLike(
    input.toolId,
    "toolId",
  );

  assertUuidLike(
    input.actorUserId,
    "actorUserId",
  );

  return db.transaction(
    async (tx) => {
      const tool =
        (
          await tx
            .select({
              id:
                tools.id,
              status:
                tools.status,
              currentVersion:
                tools.currentVersion,
              lastReviewedAt:
                tools.lastReviewedAt,
            })
            .from(tools)
            .where(
              eq(
                tools.id,
                input.toolId,
              ),
            )
            .limit(1)
        )[0];

      if (!tool) {
        throw new PublicationTargetNotFoundError();
      }

      if (!tool.currentVersion) {
        throw new Error(
          "Publication target tool has no current calculator version.",
        );
      }

      const calculatorVersion =
        (
          await tx
            .select({
              id:
                calculatorVersions.id,
              verificationStatus:
                calculatorVersions
                  .verificationStatus,
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
          await tx
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
              desc(
                formulaVersions.id,
              ),
            )
            .limit(1)
        )[0] ?? null;

      const sourceRows =
        await tx
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
          )
          .orderBy(
            asc(sources.id),
          );

      const latestReview =
        (
          await tx
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
                isNotNull(
                  reviews.reviewedAt,
                ),
              ),
            )
            .orderBy(
              desc(
                reviews.reviewedAt,
              ),
              desc(
                reviews.createdAt,
              ),
              desc(
                reviews.id,
              ),
            )
            .limit(1)
        )[0] ?? null;

      const state:
        PublicationWorkflowState = {
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
            true,

          requireVerifiedSource:
            true,
        };

      const plan =
        planPublicationWorkflow(
          input.action,
          state,
        );

      if (!plan.allowed) {
        return {
          success: false as const,
          toolId:
            input.toolId,
          issues:
            plan.issues,
        };
      }

      const audit =
        createPublicationAuditPlan(
          plan,
        );

      if (!audit) {
        throw new Error(
          "Allowed publication transition did not produce an audit plan.",
        );
      }

      const now =
        new Date();

      const [updated] =
        await tx
          .update(tools)
          .set({
            status:
              plan.toStatus,
            updatedAt:
              now,
            ...(plan.updates
              .lastReviewedAt
              ? {
                  lastReviewedAt:
                    plan.updates
                      .lastReviewedAt,
                }
              : {}),
          })
          .where(
            and(
              eq(
                tools.id,
                input.toolId,
              ),
              eq(
                tools.status,
                plan.fromStatus,
              ),
            ),
          )
          .returning({
            id:
              tools.id,
            status:
              tools.status,
            lastReviewedAt:
              tools.lastReviewedAt,
          });

      if (!updated) {
        throw new PublicationStateConflictError();
      }

      await tx
        .insert(
          auditLogs,
        )
        .values({
          actorUserId:
            input.actorUserId,
          action:
            audit.action,
          entityType:
            audit.entityType,
          entityId:
            input.toolId,
          metadata: {
            fromStatus:
              plan.fromStatus,
            toStatus:
              plan.toStatus,
            currentVersion:
              tool.currentVersion,
            ...(input.reason
              ? {
                  reason:
                    input.reason,
                }
              : {}),
          },
          message:
            audit.message,
        });

      await tx
        .insert(
          changeHistory,
        )
        .values({
          entityType:
            audit.entityType,
          entityId:
            input.toolId,
          version:
            tool.currentVersion,
          changedByUserId:
            input.actorUserId,
          summary:
            audit.changeSummary,
          before: {
            ...audit.before,
            lastReviewedAt:
              tool
                .lastReviewedAt
                ?.toISOString() ??
              null,
          },
          after:
            audit.after,
        });

      return {
        success:
          true as const,
        toolId:
          updated.id,
        fromStatus:
          plan.fromStatus,
        toStatus:
          updated.status,
        lastReviewedAt:
          updated.lastReviewedAt,
      };
    },
  );
}
