import { eq } from "drizzle-orm";

import { db } from "../client";
import {
  permissions,
  rolePermissions,
  roles,
} from "../schema/rbac";

export async function seedPlatformAdminRBAC() {
  const [existingPermission] = await db
    .select()
    .from(permissions)
    .where(eq(permissions.key, "platform.admin.access"))
    .limit(1);

  const permission =
    existingPermission ??
    (
      await db
        .insert(permissions)
        .values({
          key: "platform.admin.access",
          description:
            "Access the platform administration workspace.",
        })
        .returning()
    )[0];

  const [existingRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.key, "platform_admin"))
    .limit(1);

  const role =
    existingRole ??
    (
      await db
        .insert(roles)
        .values({
          key: "platform_admin",
          name: "Platform Admin",
          description:
            "Platform-wide administration workspace access.",
        })
        .returning()
    )[0];

  if (!permission || !role) {
    throw new Error("Failed to seed platform admin RBAC.");
  }

  await db
    .insert(rolePermissions)
    .values({
      roleId: role.id,
      permissionId: permission.id,
    })
    .onConflictDoNothing();

  return {
    roleId: role.id,
    permissionId: permission.id,
  };
}
