import "server-only";

import {
  executeAuthenticatedPublicationAction,
} from "../../../../../packages/database/src/publication/authenticated-service";

export {
  PublicationStateConflictError,
  PublicationTargetNotFoundError,
} from "../../../../../packages/database/src/publication/authenticated-service";

import type {
  PublicationWorkflowAction,
} from "../../../../../packages/database/src/publication/workflow";

export class PublicationAuthenticationError extends Error {
  constructor() {
    super(
      "Authentication is required for publication actions.",
    );

    this.name =
      "PublicationAuthenticationError";
  }
}

export type PublicationSessionLike = {
  user?: {
    id?: string | null;
  } | null;
} | null;

export type SessionPublicationRequest = {
  toolId: string;

  action:
    PublicationWorkflowAction;

  reason?: string;
};

export function getAuthenticatedPublicationUserId(
  session:
    PublicationSessionLike,
): string {
  const userId =
    session?.user?.id?.trim();

  if (!userId) {
    throw new PublicationAuthenticationError();
  }

  return userId;
}

/**
 * Server-only bridge between an Auth.js session and the database-backed
 * publication service.
 *
 * The authenticated user ID comes only from session.user.id. There is no
 * actor/userId/permission/state/policy field in the request object.
 */
export async function executeSessionPublicationAction(
  session:
    PublicationSessionLike,

  request:
    SessionPublicationRequest,
) {
  const authenticatedUserId =
    getAuthenticatedPublicationUserId(
      session,
    );

  return executeAuthenticatedPublicationAction(
    {
      toolId:
        request.toolId,

      authenticatedUserId,

      action:
        request.action,

      reason:
        request.reason,
    },
  );
}
