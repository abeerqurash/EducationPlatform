import {
  db,
} from "../client";

import {
  permissions,
  rolePermissions,
  roles,
} from "../schema";

export const defaultPermissions = [
  "tools.read",
  "tools.create",
  "tools.update",
  "tools.publish",

  "content.read",
  "content.create",
  "content.update",
  "content.publish",

  "users.read",
  "users.manage",

  "seo.read",
  "seo.manage",

  "analytics.read",

  "billing.read",
  "billing.manage",

  "organizations.read",
  "organizations.manage",

  "system.read",
  "system.manage",
] as const;

export const defaultRoles = [
  {
    key: "super_admin",
    name: "Super Admin",
  },

  {
    key: "admin",
    name: "Admin",
  },

  {
    key: "content_editor",
    name: "Content Editor",
  },

  {
    key: "seo_manager",
    name: "SEO Manager",
  },

  {
    key: "support_agent",
    name: "Support Agent",
  },

  {
    key: "student",
    name: "Student",
  },
] as const;

export async function seedRbac() {
  for (
    const key of defaultPermissions
  ) {
    await db
      .insert(permissions)
      .values({
        key,
        description:
          `Permission: ${key}`,
      })
      .onConflictDoNothing({
        target: permissions.key,
      });
  }

  for (
    const role of defaultRoles
  ) {
    await db
      .insert(roles)
      .values(role)
      .onConflictDoNothing({
        target: roles.key,
      });
  }

  const superAdmin =
    await db.query.roles.findFirst({
      where: (
        table,
        { eq },
      ) =>
        eq(
          table.key,
          "super_admin",
        ),
    });

  if (!superAdmin) {
    throw new Error(
      "Super Admin role was not created.",
    );
  }

  const allPermissions =
    await db
      .select()
      .from(permissions);

  for (
    const permission of allPermissions
  ) {
    await db
      .insert(rolePermissions)
      .values({
        roleId:
          superAdmin.id,

        permissionId:
          permission.id,
      })
      .onConflictDoNothing();
  }
}