import {
  and,
  eq,
} from "drizzle-orm";

import {
  db,
} from "../client";

import {
  permissions,
  rolePermissions,
  roles,
} from "../schema/rbac";

import {
  publicationPermissions,
} from "../publication/authorization";

export const publicationRolePolicy = {
  owner: [
    publicationPermissions
      .submitForReview,
    publicationPermissions
      .publish,
  ],

  admin: [
    publicationPermissions
      .submitForReview,
    publicationPermissions
      .publish,
  ],

  editor: [
    publicationPermissions
      .submitForReview,
  ],
} as const;

export const publicationPermissionDefinitions = [
  {
    key:
      publicationPermissions
        .submitForReview,

    description:
      "Submit calculator tools for editorial review.",
  },
  {
    key:
      publicationPermissions
        .publish,

    description:
      "Publish calculator tools after all editorial publication gates pass.",
  },
] as const;

async function ensurePermission(
  key: string,
  description: string,
) {
  const existing =
    (
      await db
        .select()
        .from(permissions)
        .where(
          eq(
            permissions.key,
            key,
          ),
        )
        .limit(1)
    )[0];

  if (existing) {
    const [updated] =
      await db
        .update(permissions)
        .set({
          description,
          updatedAt:
            new Date(),
        })
        .where(
          eq(
            permissions.id,
            existing.id,
          ),
        )
        .returning();

    return updated;
  }

  const [created] =
    await db
      .insert(permissions)
      .values({
        key,
        description,
      })
      .returning();

  return created;
}

async function findRole(
  roleKey: string,
) {
  return (
    await db
      .select()
      .from(roles)
      .where(
        eq(
          roles.key,
          roleKey,
        ),
      )
      .limit(1)
  )[0];
}

async function ensureRolePermission(
  roleId: string,
  permissionId: string,
) {
  const existing =
    (
      await db
        .select()
        .from(
          rolePermissions,
        )
        .where(
          and(
            eq(
              rolePermissions
                .roleId,
              roleId,
            ),
            eq(
              rolePermissions
                .permissionId,
              permissionId,
            ),
          ),
        )
        .limit(1)
    )[0];

  if (!existing) {
    await db
      .insert(
        rolePermissions,
      )
      .values({
        roleId,
        permissionId,
      });
  }
}

/**
 * Adds calculator publication permissions without deleting or replacing
 * any existing RBAC records.
 *
 * Existing role keys are used. This seed intentionally does not create
 * missing roles because role creation belongs to the platform's primary
 * RBAC seed.
 */
export async function seedPublicationRBAC() {
  const permissionByKey =
    new Map<
      string,
      {
        id: string;
      }
    >();

  for (
    const definition of
    publicationPermissionDefinitions
  ) {
    const permission =
      await ensurePermission(
        definition.key,
        definition.description,
      );

    permissionByKey.set(
      definition.key,
      permission,
    );
  }

  const assignedRoles:
    string[] = [];

  const missingRoles:
    string[] = [];

  for (
    const [
      roleKey,
      permissionKeys,
    ] of Object.entries(
      publicationRolePolicy,
    )
  ) {
    const role =
      await findRole(
        roleKey,
      );

    if (!role) {
      missingRoles.push(
        roleKey,
      );

      continue;
    }

    for (
      const permissionKey of
      permissionKeys
    ) {
      const permission =
        permissionByKey.get(
          permissionKey,
        );

      if (!permission) {
        throw new Error(
          `Publication permission ${permissionKey} was not seeded.`,
        );
      }

      await ensureRolePermission(
        role.id,
        permission.id,
      );
    }

    assignedRoles.push(
      roleKey,
    );
  }

  return {
    permissions:
      publicationPermissionDefinitions.map(
        (item) =>
          item.key,
      ),

    assignedRoles,
    missingRoles,
  };
}
