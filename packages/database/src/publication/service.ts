import {
  authorizePublicationAction,
  type PublicationActor,
} from "./authorization";

import {
  persistPublicationTransition,
  type PersistPublicationTransitionResult,
} from "./persistence";

import type {
  PublicationWorkflowAction,
  PublicationWorkflowState,
} from "./workflow";

export type ExecutePublicationActionInput = {
  toolId: string;

  actor:
    PublicationActor;

  action:
    PublicationWorkflowAction;

  state:
    PublicationWorkflowState;

  reason?: string;
};

export type ExecutePublicationActionResult =
  | PersistPublicationTransitionResult
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
 * Application service boundary for publication mutations.
 *
 * Route handlers/server actions should call this service rather than
 * calling persistence directly. The caller supplies the authenticated
 * user's real permission keys from RBAC.
 */
export async function executePublicationAction(
  input:
    ExecutePublicationActionInput,
): Promise<
  ExecutePublicationActionResult
> {
  const authorization =
    authorizePublicationAction(
      input.actor,
      input.action,
    );

  if (
    !authorization.allowed
  ) {
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

  return persistPublicationTransition(
    {
      toolId:
        input.toolId,

      actorUserId:
        input.actor.userId,

      action:
        input.action,

      state:
        input.state,

      reason:
        input.reason,
    },
  );
}
