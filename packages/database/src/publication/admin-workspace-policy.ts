import type {
  PublicationActor,
} from "./authorization";
import {
  publicationPermissions,
} from "./authorization";

export const adminWorkspacePermissions = {
  access: "platform.admin.access",
} as const;

export type AdminWorkspaceAccess = {
  allowed: boolean;
  mode: "dedicated" | "publication-compatibility" | "denied";
};

export function evaluateAdminWorkspaceAccess(
  actor: PublicationActor,
): AdminWorkspaceAccess {
  if (
    actor.permissionKeys.includes(
      adminWorkspacePermissions.access,
    )
  ) {
    return {
      allowed: true,
      mode: "dedicated",
    };
  }

  const hasLegacyPublicationAccess =
    actor.permissionKeys.includes(
      publicationPermissions.submitForReview,
    ) ||
    actor.permissionKeys.includes(
      publicationPermissions.publish,
    );

  return hasLegacyPublicationAccess
    ? {
        allowed: true,
        mode: "publication-compatibility",
      }
    : {
        allowed: false,
        mode: "denied",
      };
}
