import {
  authorizePublicationAction,
  type PublicationActor,
} from "./authorization";

import {
  persistTrustedPublicationTransition,
  type PersistTrustedPublicationTransitionResult,
} from "./atomic-persistence";

export {
  PublicationStateConflictError,
  PublicationTargetNotFoundError,
} from "./atomic-persistence";

import type {
  PublicationWorkflowAction,
} from "./workflow";

export type ExecuteTrustedPublicationActionInput = {
  toolId: string;
  actor: PublicationActor;
  action: PublicationWorkflowAction;
  reason?: string;
};

export type ExecuteTrustedPublicationActionResult =
  | PersistTrustedPublicationTransitionResult
  | {
      success: false;
      toolId: string;
      authorizationError: {
        requiredPermission:
          string;
        message: string;
      };
    };

/**
 * Trusted publication application service.
 *
 * Authorization is checked first. Editorial state is then reconstructed
 * and persisted by one transactional adapter. Callers cannot supply
 * verification/review state or publication-policy overrides.
 */
export async function executeTrustedPublicationAction(
  input:
    ExecuteTrustedPublicationActionInput,
): Promise<
  ExecuteTrustedPublicationActionResult
> {
  const authorization =
    authorizePublicationAction(
      input.actor,
      input.action,
    );

  if (!authorization.allowed) {
    return {
      success: false,
      toolId:
        input.toolId,
      authorizationError: {
        requiredPermission:
          authorization
            .requiredPermission,
        message:
          authorization.reason,
      },
    };
  }

  return persistTrustedPublicationTransition(
    {
      toolId:
        input.toolId,
      actorUserId:
        input.actor.userId,
      action:
        input.action,
      reason:
        input.reason,
    },
  );
}
