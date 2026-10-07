import {
  eq,
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

export type PersistPublicationTransitionInput = {
  toolId: string;
  actorUserId: string;
  state: PublicationWorkflowState;
  action: PublicationWorkflowAction;
  reason?: string;
};

export type PersistPublicationTransitionResult =
  | {
      success: true;
      toolId: string;
      fromStatus:
        PublicationWorkflowState[
          "toolStatus"
        ];
      toStatus:
        PublicationWorkflowState[
          "toolStatus"
        ];
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

function assertUuidLike(
  value: string,
  field: string,
) {
  const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuid.test(value)) {
    throw new Error(
      `${field} must be a valid UUID.`,
    );
  }
}

/**
 * Persists an already-resolved publication state transition.
 *
 * The workflow/gate remains the source of truth for whether the
 * transition is allowed. Tool mutation, audit log and change-history
 * record are committed in one PostgreSQL transaction.
 *
 * The authenticated caller must provide actorUserId. This function
 * never invents or substitutes an actor.
 */
export async function persistPublicationTransition(
  input:
    PersistPublicationTransitionInput,
): Promise<
  PersistPublicationTransitionResult
> {
  assertUuidLike(
    input.toolId,
    "toolId",
  );

  assertUuidLike(
    input.actorUserId,
    "actorUserId",
  );

  const plan =
    planPublicationWorkflow(
      input.action,
      input.state,
    );

  if (!plan.allowed) {
    return {
      success: false,
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

  return db.transaction(
    async (tx) => {
      const existing =
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

      if (!existing) {
        throw new Error(
          "Publication target tool was not found.",
        );
      }

      /*
       * Optimistic state check:
       * do not apply a plan calculated from stale UI/server state.
       */
      if (
        existing.status !==
        plan.fromStatus
      ) {
        throw new Error(
          `Publication state changed before commit. Expected ${plan.fromStatus}, found ${existing.status}.`,
        );
      }

      const now =
        new Date();

      const updateValues = {
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
      };

      const [updated] =
        await tx
          .update(tools)
          .set(
            updateValues,
          )
          .where(
            eq(
              tools.id,
              input.toolId,
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
        throw new Error(
          "Publication target tool could not be updated.",
        );
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
              existing.currentVersion,
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
            existing.currentVersion,

          changedByUserId:
            input.actorUserId,

          summary:
            audit.changeSummary,

          before: {
            ...audit.before,
            lastReviewedAt:
              existing
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
