import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

import {
  resolvePublicationActor,
} from "../../../../packages/database/src/publication/actor-resolver";
import {
  evaluateAdminWorkspaceAccess,
} from "../../../../packages/database/src/publication/admin-workspace-policy";
import {
  publicationPermissions,
} from "../../../../packages/database/src/publication/authorization";

export async function requireAdminWorkspaceAccess(
  callbackUrl: string,
) {
  const session = await auth();
  const user = session?.user;
  const userId = user?.id?.trim();

  if (!user || !userId) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }

  const actor = await resolvePublicationActor(userId);

  const canSubmit = actor.permissionKeys.includes(
    publicationPermissions.submitForReview,
  );
  const canPublish = actor.permissionKeys.includes(
    publicationPermissions.publish,
  );

  const workspaceAccess =
    evaluateAdminWorkspaceAccess(actor);

  if (!workspaceAccess.allowed) {
    redirect("/dashboard");
  }

  return {
    user,
    actor,
    canSubmit,
    canPublish,
    accessMode: workspaceAccess.mode,
  };
}
