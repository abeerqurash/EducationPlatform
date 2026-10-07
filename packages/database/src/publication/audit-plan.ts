import type {
  PublicationWorkflowPlan,
} from "./workflow";

export type PublicationAuditAction =
  | "update"
  | "publish";

export type PublicationAuditPlan = {
  action:
    PublicationAuditAction;

  entityType:
    "tool";

  message: string;

  changeSummary: string;

  before: {
    status: string;
  };

  after: {
    status: string;
    lastReviewedAt?: string;
  };
};

/**
 * Produces the audit/change-history payload that a transactional
 * persistence adapter will write alongside the tool update.
 *
 * No actor is invented here. The caller must supply the authenticated
 * reviewer/admin when the database adapter is added.
 */
export function createPublicationAuditPlan(
  plan: PublicationWorkflowPlan,
): PublicationAuditPlan | null {
  if (!plan.allowed) {
    return null;
  }

  const lastReviewedAt =
    plan.updates
      .lastReviewedAt
      ?.toISOString();

  if (
    plan.action ===
    "publish"
  ) {
    return {
      action:
        "publish",

      entityType:
        "tool",

      message:
        "Calculator tool published after passing the editorial publication gate.",

      changeSummary:
        `Tool status changed from ${plan.fromStatus} to published.`,

      before: {
        status:
          plan.fromStatus,
      },

      after: {
        status:
          "published",

        ...(lastReviewedAt
          ? {
              lastReviewedAt,
            }
          : {}),
      },
    };
  }

  return {
    action:
      "update",

    entityType:
      "tool",

    message:
      "Calculator tool submitted for editorial review.",

    changeSummary:
      `Tool status changed from ${plan.fromStatus} to review.`,

    before: {
      status:
        plan.fromStatus,
    },

    after: {
      status:
        "review",
    },
  };
}
