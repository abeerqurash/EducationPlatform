import {
  resolvePublicationActor,
} from "./actor-resolver";

import {
  executeTrustedPublicationAction,
  type ExecuteTrustedPublicationActionResult,
} from "./secure-service";

export {
  PublicationStateConflictError,
  PublicationTargetNotFoundError,
} from "./secure-service";

import type {
  PublicationWorkflowAction,
} from "./workflow";

export type ExecuteAuthenticatedPublicationActionInput = {
  toolId: string;
  authenticatedUserId: string;
  action: PublicationWorkflowAction;
  reason?: string;
};

/**
 * Resolves permissions from persisted RBAC and forwards only trusted
 * server identity plus the requested publication action.
 */
export async function executeAuthenticatedPublicationAction(
  input:
    ExecuteAuthenticatedPublicationActionInput,
): Promise<
  ExecuteTrustedPublicationActionResult
> {
  const actor =
    await resolvePublicationActor(
      input.authenticatedUserId,
    );

  return executeTrustedPublicationAction(
    {
      toolId:
        input.toolId,
      actor,
      action:
        input.action,
      reason:
        input.reason,
    },
  );
}
