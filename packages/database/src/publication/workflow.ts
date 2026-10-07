import type {
  EditorialGateInput,
  EditorialGateIssue,
} from "./editorial-gate";

import {
  evaluateEditorialPublicationGate,
} from "./editorial-gate";

export type PublicationWorkflowAction =
  | "submit_for_review"
  | "publish";

export type PublicationWorkflowState = {
  toolStatus:
    EditorialGateInput["toolStatus"];

  calculatorVerificationStatus:
    EditorialGateInput[
      "calculatorVerificationStatus"
    ];

  formulaVerificationStatus?:
    EditorialGateInput[
      "formulaVerificationStatus"
    ];

  sourceVerificationStatuses:
    EditorialGateInput[
      "sourceVerificationStatuses"
    ];

  latestReviewStatus?:
    EditorialGateInput[
      "latestReviewStatus"
    ];

  latestReviewReviewedAt?:
    Date | null;

  requireFormula?: boolean;
  requireVerifiedSource?: boolean;
};

export type PublicationWorkflowPlan = {
  action: PublicationWorkflowAction;
  allowed: boolean;

  fromStatus:
    EditorialGateInput["toolStatus"];

  toStatus:
    EditorialGateInput["toolStatus"];

  issues: EditorialGateIssue[];

  updates: {
    toolStatus?:
      EditorialGateInput["toolStatus"];

    lastReviewedAt?:
      Date;
  };
};

const ALREADY_PUBLISHED: EditorialGateIssue = {
  code: "TOOL_NOT_IN_REVIEW",
  message:
    "A published tool cannot be submitted for review again without first entering an editorial revision workflow.",
};

const ARCHIVED_TOOL: EditorialGateIssue = {
  code: "TOOL_NOT_IN_REVIEW",
  message:
    "An archived tool cannot enter review through the publication workflow.",
};

/**
 * Pure planning layer for publication transitions.
 *
 * It deliberately does not mutate the database. A later persistence
 * adapter can execute an allowed plan inside a database transaction
 * together with audit/change-history writes.
 */
export function planPublicationWorkflow(
  action: PublicationWorkflowAction,
  state: PublicationWorkflowState,
): PublicationWorkflowPlan {
  if (
    action === "submit_for_review"
  ) {
    if (
      state.toolStatus ===
      "archived"
    ) {
      return {
        action,
        allowed: false,
        fromStatus:
          state.toolStatus,
        toStatus:
          state.toolStatus,
        issues: [
          ARCHIVED_TOOL,
        ],
        updates: {},
      };
    }

    if (
      state.toolStatus ===
      "published"
    ) {
      return {
        action,
        allowed: false,
        fromStatus:
          state.toolStatus,
        toStatus:
          state.toolStatus,
        issues: [
          ALREADY_PUBLISHED,
        ],
        updates: {},
      };
    }

    return {
      action,
      allowed: true,
      fromStatus:
        state.toolStatus,
      toStatus:
        "review",
      issues: [],
      updates: {
        toolStatus:
          "review",
      },
    };
  }

  const gate =
    evaluateEditorialPublicationGate(
      {
        toolStatus:
          state.toolStatus,

        calculatorVerificationStatus:
          state.calculatorVerificationStatus,

        formulaVerificationStatus:
          state.formulaVerificationStatus,

        sourceVerificationStatuses:
          state.sourceVerificationStatuses,

        latestReviewStatus:
          state.latestReviewStatus,

        latestReviewReviewedAt:
          state.latestReviewReviewedAt,

        requireFormula:
          state.requireFormula,

        requireVerifiedSource:
          state.requireVerifiedSource,
      },
    );

  if (!gate.canPublish) {
    return {
      action,
      allowed: false,
      fromStatus:
        state.toolStatus,
      toStatus:
        state.toolStatus,
      issues:
        gate.issues,
      updates: {},
    };
  }

  return {
    action,
    allowed: true,
    fromStatus:
      state.toolStatus,
    toStatus:
      "published",
    issues: [],
    updates: {
      toolStatus:
        "published",

      lastReviewedAt:
        state.latestReviewReviewedAt!,
    },
  };
}
