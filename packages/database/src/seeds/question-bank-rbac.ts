import { eq } from "drizzle-orm";
import { db } from "../client";
import { permissions, rolePermissions, roles } from "../schema/rbac";
import { questionBankPermissions } from "../question-bank/contract";

/** Creates scoped roles without granting any user access or changing existing role grants. */
export async function seedQuestionBankRBAC() {
  return db.transaction(async tx => {
    for (const [key, name, permissionKey] of [
      ["question_author", "Question Author", questionBankPermissions.author],
      ["question_reviewer", "Question Reviewer", questionBankPermissions.review],
    ] as const) {
      await tx.insert(roles).values({ key, name, description: "Scoped question-bank editorial access." }).onConflictDoNothing();
      await tx.insert(permissions).values({ key: permissionKey, description: name + " question-bank workflow." }).onConflictDoNothing();
      const [role] = await tx.select({ id: roles.id }).from(roles).where(eq(roles.key, key));
      const [permission] = await tx.select({ id: permissions.id }).from(permissions).where(eq(permissions.key, permissionKey));
      if (!role || !permission) throw new Error("Unable to seed question-bank roles.");
      await tx.insert(rolePermissions).values({ roleId: role.id, permissionId: permission.id }).onConflictDoNothing();
    }
    return { roleKeys: ["question_author", "question_reviewer"], userGrantsChanged: false };
  });
}
