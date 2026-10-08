"use server";

import { revalidatePath } from "next/cache";

import {
  assignUserRole,
  bootstrapFirstPlatformAdmin,
  getPlatformAdminBootstrapState,
  removeUserRole,
  setUserActiveState,
} from "@education/database";

import { auth } from "@/auth";
import {
  resolvePublicationActor,
} from "../../../../../packages/database/src/publication/actor-resolver";
import {
  adminWorkspacePermissions,
  evaluateAdminWorkspaceAccess,
} from "../../../../../packages/database/src/publication/admin-workspace-policy";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ROLE_KEY = /^[a-z0-9][a-z0-9._-]{1,99}$/;

async function currentIdentity() {
  const session = await auth();
  const userId = session?.user?.id?.trim();

  if (!userId || !UUID.test(userId)) {
    throw new Error("Authentication required.");
  }

  const actor = await resolvePublicationActor(userId);
  return { userId, actor };
}

async function requireDedicatedAdmin() {
  const identity = await currentIdentity();

  if (
    !identity.actor.permissionKeys.includes(
      adminWorkspacePermissions.access,
    )
  ) {
    throw new Error(
      "Dedicated platform administrator access is required.",
    );
  }

  return identity.userId;
}

function reason(formData: FormData) {
  const value = String(formData.get("reason") ?? "").trim();
  if (value.length < 8 || value.length > 500) {
    throw new Error(
      "A reason between 8 and 500 characters is required.",
    );
  }
  return value;
}

function target(formData: FormData) {
  const value = String(formData.get("targetUserId") ?? "").trim();
  if (!UUID.test(value)) {
    throw new Error("Invalid target user.");
  }
  return value;
}

function roleKey(formData: FormData) {
  const value = String(formData.get("roleKey") ?? "").trim();
  if (!ROLE_KEY.test(value)) {
    throw new Error("Invalid role.");
  }
  return value;
}

function refreshAccess() {
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function bootstrapPlatformAdminAction(
  formData: FormData,
) {
  const { userId, actor } = await currentIdentity();
  const access = evaluateAdminWorkspaceAccess(actor);
  const state = await getPlatformAdminBootstrapState();

  if (
    !access.allowed ||
    access.mode !== "publication-compatibility" ||
    !state.seeded ||
    !state.needsFirstAdmin
  ) {
    throw new Error(
      "Platform administrator bootstrap is not available.",
    );
  }

  await bootstrapFirstPlatformAdmin({
    actorUserId: userId,
    reason: reason(formData),
  });

  refreshAccess();
}

export async function assignUserRoleAction(formData: FormData) {
  const actorUserId = await requireDedicatedAdmin();

  await assignUserRole({
    actorUserId,
    targetUserId: target(formData),
    roleKey: roleKey(formData),
    reason: reason(formData),
  });

  refreshAccess();
}

export async function removeUserRoleAction(formData: FormData) {
  const actorUserId = await requireDedicatedAdmin();

  await removeUserRole({
    actorUserId,
    targetUserId: target(formData),
    roleKey: roleKey(formData),
    reason: reason(formData),
  });

  refreshAccess();
}

export async function setUserActiveStateAction(formData: FormData) {
  const actorUserId = await requireDedicatedAdmin();
  const active = String(formData.get("active") ?? "") === "true";

  await setUserActiveState({
    actorUserId,
    targetUserId: target(formData),
    isActive: active,
    reason: reason(formData),
  });

  refreshAccess();
}
