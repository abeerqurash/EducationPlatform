import type {
  PublicationWorkflowAction,
} from "./workflow";

export const publicationPermissions = {
  submitForReview:
    "calculators.review.submit",

  publish:
    "calculators.publish",
} as const;

export type PublicationPermission =
  (typeof publicationPermissions)[
    keyof typeof publicationPermissions
  ];

export type PublicationActor = {
  userId: string;
  permissionKeys: readonly string[];
};

export type PublicationAuthorizationResult =
  | {
      allowed: true;
      requiredPermission:
        PublicationPermission;
    }
  | {
      allowed: false;
      requiredPermission:
        PublicationPermission;
      reason: string;
    };

export function requiredPermissionForPublicationAction(
  action: PublicationWorkflowAction,
): PublicationPermission {
  return action === "publish"
    ? publicationPermissions.publish
    : publicationPermissions.submitForReview;
}

export function authorizePublicationAction(
  actor: PublicationActor,
  action: PublicationWorkflowAction,
): PublicationAuthorizationResult {
  const requiredPermission =
    requiredPermissionForPublicationAction(
      action,
    );

  if (
    actor.permissionKeys.includes(
      requiredPermission,
    )
  ) {
    return {
      allowed: true,
      requiredPermission,
    };
  }

  return {
    allowed: false,
    requiredPermission,
    reason:
      `Permission ${requiredPermission} is required for ${action}.`,
  };
}
