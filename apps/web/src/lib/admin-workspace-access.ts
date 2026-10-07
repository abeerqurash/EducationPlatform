import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

import {
  resolvePublicationActor,
} from "../../../../packages/database/src/publication/actor-resolver";
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

  if (!canSubmit && !canPublish) {
    redirect("/dashboard");
  }

  return {
    user,
    actor,
    canSubmit,
    canPublish,
  };
}
