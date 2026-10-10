import { eq } from 'drizzle-orm';
import { db } from '../client';
import { permissions,roles,rolePermissions } from '../schema/rbac';
import { workspacePermissions } from '../learning-workspaces/contract';
export async function seedLearningWorkspacesRBAC(){return db.transaction(async tx=>{for(const [key,name,permissionKey] of [['educator_workspace','Educator workspace',workspacePermissions.educator],['support_workspace','Support workspace',workspacePermissions.support]]){await tx.insert(roles).values({key:key!,name:name!}).onConflictDoNothing();await tx.insert(permissions).values({key:permissionKey!,description:name!}).onConflictDoNothing();const [role]=await tx.select().from(roles).where(eq(roles.key,key!));const [permission]=await tx.select().from(permissions).where(eq(permissions.key,permissionKey!));if(!role||!permission)throw new Error('Role seed failed.');await tx.insert(rolePermissions).values({roleId:role.id,permissionId:permission.id}).onConflictDoNothing();}});}
