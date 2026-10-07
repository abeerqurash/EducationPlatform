import {
  db,
  permissions,
  rolePermissions,
  roles,
  userRoles,
  users,
} from "@education/database";

import type {
  PermissionKey,
} from "@education/auth";

import {
  and,
  eq,
} from "drizzle-orm";

import { auth } from "@/auth";

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(
      and(
        eq(
          users.id,
          session.user.id,
        ),
        eq(users.isActive, true),
      ),
    )
    .limit(1);

  return user ?? null;
}

export async function requireUser() {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "UNAUTHENTICATED",
    );
  }

  return user;
}

export async function userHasPermission(
  userId: string,
  permission: PermissionKey,
) {
  const result = await db
    .select({
      id: permissions.id,
    })
    .from(userRoles)
    .innerJoin(
      roles,
      eq(
        userRoles.roleId,
        roles.id,
      ),
    )
    .innerJoin(
      rolePermissions,
      eq(
        rolePermissions.roleId,
        roles.id,
      ),
    )
    .innerJoin(
      permissions,
      eq(
        rolePermissions.permissionId,
        permissions.id,
      ),
    )
    .where(
      and(
        eq(
          userRoles.userId,
          userId,
        ),
        eq(
          permissions.key,
          permission,
        ),
      ),
    )
    .limit(1);

  return result.length > 0;
}

export async function requirePermission(
  permission: PermissionKey,
) {
  const user =
    await requireUser();

  const allowed =
    await userHasPermission(
      user.id,
      permission,
    );

  if (!allowed) {
    throw new Error(
      "FORBIDDEN",
    );
  }

  return user;
}