import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
} from "drizzle-orm";

import { db } from "../client";
import { auditLogs } from "../schema/audit";
import {
  permissions,
  rolePermissions,
  roles,
  userRoles,
} from "../schema/rbac";
import { users } from "../schema/users";

export const PLATFORM_ADMIN_ROLE = "platform_admin";
export const PLATFORM_ADMIN_PERMISSION = "platform.admin.access";

export async function listAdminUsers(input?: {
  query?: string;
  limit?: number;
  offset?: number;
}) {
  const limit = Math.min(50, Math.max(1, input?.limit ?? 25));
  const offset = Number.isSafeInteger(input?.offset)
    ? Math.max(0, Math.min(2_500_000, input!.offset!))
    : 0;
  const query = input?.query?.trim().slice(0, 160);

  const where = query
    ? or(
        ilike(users.email, `%${query}%`),
        ilike(users.name, `%${query}%`),
      )
    : undefined;

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      accountRole: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(where)
    .orderBy(desc(users.createdAt), desc(users.id))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(where);

  const roleRows = rows.length
    ? await db
        .select({
          userId: userRoles.userId,
          roleKey: roles.key,
          roleName: roles.name,
        })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .where(
          inArray(userRoles.userId, rows.map((row) => row.id)),
        )
        .orderBy(asc(roles.name), asc(roles.id))
    : [];

  return {
    users: rows.map((row) => ({
      ...row,
      roles: roleRows
        .filter((role) => role.userId === row.id)
        .map((role) => ({
          key: role.roleKey,
          name: role.roleName,
        })),
    })),
    total: count ?? 0,
    limit,
    offset,
  };
}

export async function listAssignableAdminRoles() {
  return db
    .select({
      id: roles.id,
      key: roles.key,
      name: roles.name,
      description: roles.description,
    })
    .from(roles)
    .orderBy(asc(roles.name), asc(roles.id));
}

export async function getAdminAccessSummary() {
  const [userCount, adminCount, roleCount, inactiveCount] =
    await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(users),
      db
        .select({
          count: sql<number>`count(distinct ${userRoles.userId})::int`,
        })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
        .innerJoin(
          permissions,
          and(
            eq(rolePermissions.permissionId, permissions.id),
            eq(permissions.key, PLATFORM_ADMIN_PERMISSION),
          ),
        ),
      db.select({ count: sql<number>`count(*)::int` }).from(roles),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(eq(users.isActive, false)),
    ]);

  return {
    totalUsers: userCount[0]?.count ?? 0,
    dedicatedAdmins: adminCount[0]?.count ?? 0,
    totalRoles: roleCount[0]?.count ?? 0,
    inactiveUsers: inactiveCount[0]?.count ?? 0,
  };
}

export async function getPlatformAdminBootstrapState() {
  const [permission] = await db
    .select({ id: permissions.id })
    .from(permissions)
    .where(eq(permissions.key, PLATFORM_ADMIN_PERMISSION))
    .limit(1);

  const [role] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.key, PLATFORM_ADMIN_ROLE))
    .limit(1);

  if (!permission || !role) {
    return {
      seeded: false,
      dedicatedAdminCount: 0,
      needsFirstAdmin: false,
    };
  }

  const [{ count }] = await db
    .select({
      count: sql<number>`count(distinct ${userRoles.userId})::int`,
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(roles.key, PLATFORM_ADMIN_ROLE));

  return {
    seeded: true,
    dedicatedAdminCount: count ?? 0,
    needsFirstAdmin: (count ?? 0) === 0,
  };
}

export async function bootstrapFirstPlatformAdmin(input: {
  actorUserId: string;
  reason: string;
}) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(741921, 1)`);
    const [role] = await tx
      .select({
        id: roles.id,
        key: roles.key,
        name: roles.name,
      })
      .from(roles)
      .where(eq(roles.key, PLATFORM_ADMIN_ROLE))
      .limit(1);

    if (!role) {
      throw new Error("Requested role does not exist.");
    }


    const [{ count }] = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(userRoles)
      .where(eq(userRoles.roleId, role.id));

    if ((count ?? 0) > 0) {
      throw new Error(
        "Platform administrator bootstrap is already complete.",
      );
    }

    const [actor] = await tx
      .select({ id: users.id, email: users.email, isActive: users.isActive })
      .from(users)
      .where(eq(users.id, input.actorUserId))
      .limit(1);

    if (!actor?.isActive) {
      throw new Error("Only an active authenticated account can bootstrap.");
    }

    await tx
      .insert(userRoles)
      .values({ userId: actor.id, roleId: role.id })
      .onConflictDoNothing();

    await tx.insert(auditLogs).values({
      actorUserId: actor.id,
      action: "permission_change",
      entityType: "user",
      entityId: actor.id,
      message: "Initial platform administrator bootstrapped.",
      metadata: {
        roleKey: PLATFORM_ADMIN_ROLE,
        reason: input.reason,
        targetEmail: actor.email,
      },
    });

    return { userId: actor.id };
  });
}

export async function assignUserRole(input: {
  actorUserId: string;
  targetUserId: string;
  roleKey: string;
  reason: string;
}) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(741921, 1)`);
    const [role] = await tx
      .select({
        id: roles.id,
        key: roles.key,
        name: roles.name,
      })
      .from(roles)
      .where(eq(roles.key, input.roleKey))
      .limit(1);

    if (!role) {
      throw new Error("Requested role does not exist.");
    }


    const [target] = await tx
      .select({ id: users.id, email: users.email, isActive: users.isActive })
      .from(users)
      .where(eq(users.id, input.targetUserId))
      .limit(1);

    if (!target?.isActive) {
      throw new Error("Roles can only be assigned to active accounts.");
    }

    const inserted = await tx
      .insert(userRoles)
      .values({ userId: target.id, roleId: role.id })
      .onConflictDoNothing()
      .returning({ userId: userRoles.userId });

    if (!inserted.length) {
      return { userId: target.id, roleKey: role.key, changed: false };
    }

    await tx.insert(auditLogs).values({
      actorUserId: input.actorUserId,
      action: "permission_change",
      entityType: "user",
      entityId: target.id,
      message: `Role ${role.name} assigned.`,
      metadata: {
        roleKey: role.key,
        reason: input.reason,
        targetEmail: target.email,
      },
    });

    return { userId: target.id, roleKey: role.key, changed: true };
  });
}

export async function removeUserRole(input: {
  actorUserId: string;
  targetUserId: string;
  roleKey: string;
  reason: string;
}) {
  if (
    input.actorUserId === input.targetUserId &&
    input.roleKey === PLATFORM_ADMIN_ROLE
  ) {
    throw new Error(
      "You cannot revoke your own platform administrator access.",
    );
  }

  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(741921, 1)`);
    const [role] = await tx
      .select({
        id: roles.id,
        key: roles.key,
        name: roles.name,
      })
      .from(roles)
      .where(eq(roles.key, input.roleKey))
      .limit(1);

    if (!role) {
      throw new Error("Requested role does not exist.");
    }


    if (role.key === PLATFORM_ADMIN_ROLE) {
      const [{ count }] = await tx
        .select({ count: sql<number>`count(*)::int` })
        .from(userRoles)
        .innerJoin(users, eq(users.id, userRoles.userId))
        .where(and(eq(userRoles.roleId, role.id), eq(users.isActive, true)));

      if ((count ?? 0) <= 1) {
        throw new Error(
          "The final platform administrator cannot be revoked.",
        );
      }
    }

    const deleted = await tx
      .delete(userRoles)
      .where(
        and(
          eq(userRoles.userId, input.targetUserId),
          eq(userRoles.roleId, role.id),
        ),
      )
      .returning({ userId: userRoles.userId });

    if (!deleted.length) {
      return { userId: input.targetUserId, roleKey: role.key, changed: false };
    }

    await tx.insert(auditLogs).values({
      actorUserId: input.actorUserId,
      action: "permission_change",
      entityType: "user",
      entityId: input.targetUserId,
      message: `Role ${role.name} removed.`,
      metadata: {
        roleKey: role.key,
        reason: input.reason,
      },
    });

    return { userId: input.targetUserId, roleKey: role.key, changed: true };
  });
}

export async function setUserActiveState(input: {
  actorUserId: string;
  targetUserId: string;
  isActive: boolean;
  reason: string;
}) {
  if (
    input.actorUserId === input.targetUserId &&
    !input.isActive
  ) {
    throw new Error("You cannot deactivate your own account.");
  }

  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(741921, 1)`);
    if (!input.isActive) {
      const [platformRole] = await tx
        .select({ id: roles.id })
        .from(roles)
        .where(eq(roles.key, PLATFORM_ADMIN_ROLE))
        .limit(1);

      if (platformRole) {
        const [membership] = await tx
          .select({ userId: userRoles.userId })
          .from(userRoles)
          .where(
            and(
              eq(userRoles.userId, input.targetUserId),
              eq(userRoles.roleId, platformRole.id),
            ),
          )
          .limit(1);

        if (membership) {
          const [{ count }] = await tx
            .select({ count: sql<number>`count(*)::int` })
            .from(userRoles)
            .innerJoin(users, eq(users.id, userRoles.userId))
            .where(and(eq(userRoles.roleId, platformRole.id), eq(users.isActive, true)));

          if ((count ?? 0) <= 1) {
            throw new Error(
              "The final platform administrator cannot be deactivated.",
            );
          }
        }
      }
    }

    const [updated] = await tx
      .update(users)
      .set({
        isActive: input.isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, input.targetUserId))
      .returning({
        id: users.id,
        email: users.email,
        isActive: users.isActive,
      });

    if (!updated) {
      throw new Error("Target user does not exist.");
    }

    await tx.insert(auditLogs).values({
      actorUserId: input.actorUserId,
      action: "permission_change",
      entityType: "user",
      entityId: updated.id,
      message: updated.isActive
        ? "User account activated."
        : "User account deactivated.",
      metadata: {
        reason: input.reason,
        targetEmail: updated.email,
      },
    });

    return updated;
  });
}

export async function listAccessAudit(limit = 30) {
  return db
    .select({
      id: auditLogs.id,
      actorUserId: auditLogs.actorUserId,
      entityId: auditLogs.entityId,
      message: auditLogs.message,
      metadata: auditLogs.metadata,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .where(eq(auditLogs.action, "permission_change"))
    .orderBy(desc(auditLogs.createdAt), desc(auditLogs.id))
    .limit(Math.min(100, Math.max(1, limit)));
}
