import {
  eq,
} from "drizzle-orm";

import {
  db,
} from "../client";

import {
  permissions,
  rolePermissions,
  userRoles,
} from "../schema/rbac";

import type {
  PublicationActor,
} from "./authorization";

export class PublicationActorNotFoundError extends Error {
  constructor(
    public readonly userId: string,
  ) {
    super(
      "Authenticated user has no database RBAC identity.",
    );

    this.name =
      "PublicationActorNotFoundError";
  }
}

/**
 * Resolves publication permissions exclusively from persisted RBAC
 * relationships. No permission array supplied by a browser/client is
 * accepted by this resolver.
 */
export async function resolvePublicationActor(
  userId: string,
): Promise<
  PublicationActor
> {
  const rows =
    await db
      .select({
        permissionKey:
          permissions.key,
      })
      .from(userRoles)
      .innerJoin(
        rolePermissions,
        eq(
          userRoles.roleId,
          rolePermissions.roleId,
        ),
      )
      .innerJoin(
        permissions,
        eq(
          rolePermissions
            .permissionId,
          permissions.id,
        ),
      )
      .where(
        eq(
          userRoles.userId,
          userId,
        ),
      );

  /*
   * An authenticated account may legitimately have zero publication
   * permissions. Authorization will deny the requested action.
   */
  const permissionKeys =
    Array.from(
      new Set(
        rows.map(
          (row) =>
            row.permissionKey,
        ),
      ),
    );

  return {
    userId,
    permissionKeys,
  };
}
