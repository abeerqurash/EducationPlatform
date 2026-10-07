import {
  eq,
} from "drizzle-orm";

import { db } from "../client";

import {
  permissions,
  rolePermissions,
  roles,
} from "../schema/rbac";

const permissionDefinitions = [
  {
    key:
      "calculators.read",

    description:
      "View calculator administration data.",
  },
  {
    key:
      "calculators.create",

    description:
      "Create calculator records and versions.",
  },
  {
    key:
      "calculators.update",

    description:
      "Update calculator records and versions.",
  },
  {
    key:
      "calculators.publish",

    description:
      "Publish or unpublish calculators.",
  },
  {
    key:
      "calculators.verify",

    description:
      "Verify calculator and formula versions.",
  },
  {
    key:
      "calculators.review",

    description:
      "Review calculator versions.",
  },
  {
    key:
      "sources.manage",

    description:
      "Create, update and link calculator sources.",
  },
] as const;

const roleDefinitions = [
  {
    key:
      "calculator_editor",

    name:
      "Calculator Editor",

    description:
      "Creates and maintains calculator content and versions.",

    permissions: [
      "calculators.read",
      "calculators.create",
      "calculators.update",
      "sources.manage",
    ],
  },

  {
    key:
      "calculator_reviewer",

    name:
      "Calculator Reviewer",

    description:
      "Reviews calculator methodology, formulas and sources.",

    permissions: [
      "calculators.read",
      "calculators.review",
    ],
  },

  {
    key:
      "calculator_verifier",

    name:
      "Calculator Verifier",

    description:
      "Verifies approved calculator and formula versions.",

    permissions: [
      "calculators.read",
      "calculators.verify",
    ],
  },

  {
    key:
      "calculator_publisher",

    name:
      "Calculator Publisher",

    description:
      "Controls calculator publication.",

    permissions: [
      "calculators.read",
      "calculators.publish",
    ],
  },
] as const;

export async function seedCalculatorRBAC() {
  console.log(
    "Seeding calculator RBAC...",
  );

  const permissionMap =
    new Map<
      string,
      string
    >();

  for (
    const definition
    of permissionDefinitions
  ) {
    const existing =
      (
        await db
          .select()
          .from(
            permissions,
          )
          .where(
            eq(
              permissions.key,
              definition.key,
            ),
          )
          .limit(1)
      )[0];

    const permission =
      existing
        ? (
            await db
              .update(
                permissions,
              )
              .set({
                description:
                  definition.description,

                updatedAt:
                  new Date(),
              })
              .where(
                eq(
                  permissions.id,
                  existing.id,
                ),
              )
              .returning()
          )[0]
        : (
            await db
              .insert(
                permissions,
              )
              .values({
                key:
                  definition.key,

                description:
                  definition.description,
              })
              .returning()
          )[0];

    permissionMap.set(
      permission.key,
      permission.id,
    );
  }

  for (
    const definition
    of roleDefinitions
  ) {
    const existing =
      (
        await db
          .select()
          .from(roles)
          .where(
            eq(
              roles.key,
              definition.key,
            ),
          )
          .limit(1)
      )[0];

    const role =
      existing
        ? (
            await db
              .update(roles)
              .set({
                name:
                  definition.name,

                description:
                  definition.description,

                updatedAt:
                  new Date(),
              })
              .where(
                eq(
                  roles.id,
                  existing.id,
                ),
              )
              .returning()
          )[0]
        : (
            await db
              .insert(roles)
              .values({
                key:
                  definition.key,

                name:
                  definition.name,

                description:
                  definition.description,
              })
              .returning()
          )[0];

    for (
      const permissionKey
      of definition.permissions
    ) {
      const permissionId =
        permissionMap.get(
          permissionKey,
        );

      if (!permissionId) {
        throw new Error(
          `Missing permission: ${permissionKey}`,
        );
      }

      await db
        .insert(
          rolePermissions,
        )
        .values({
          roleId:
            role.id,

          permissionId,
        })
        .onConflictDoNothing();
    }
  }

  console.log(
    "Calculator RBAC seeded.",
  );
}