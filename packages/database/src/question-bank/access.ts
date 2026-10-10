import { and, eq, inArray } from "drizzle-orm";
import { db } from "../client";
import { permissions, rolePermissions, userRoles } from "../schema/rbac";
import { users } from "../schema/users";
import { isQuestionId, QuestionBankError } from "./contract";

export type BankTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
/** Lock the active account and persisted RBAC rows throughout each mutation. */
export async function requireBankPermission(tx: BankTransaction, userId: string, keys: readonly string[]) {
  if (!isQuestionId(userId)) throw new QuestionBankError("Authentication required.");
  const rows = await tx.select({ permission: permissions.key }).from(userRoles)
    .innerJoin(users, eq(users.id, userRoles.userId))
    .innerJoin(rolePermissions, eq(rolePermissions.roleId, userRoles.roleId))
    .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
    .where(and(eq(users.id, userId), eq(users.isActive, true), inArray(permissions.key, [...keys]))).for("share");
  if (!rows.length) throw new QuestionBankError("Question-bank permission required.");
  return { userId, permissionKeys: rows.map(row => row.permission) };
}
export async function requireActiveStudent(tx: BankTransaction, userId: string) {
  if (!isQuestionId(userId)) throw new QuestionBankError("Authentication required.");
  const [user] = await tx.select({ id: users.id }).from(users).where(and(eq(users.id, userId), eq(users.isActive, true))).for("update");
  if (!user) throw new QuestionBankError("Active account required.");
}
