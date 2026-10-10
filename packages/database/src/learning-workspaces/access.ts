import { and,eq } from 'drizzle-orm';
import { db } from '../client';
import { activeAccount } from '../account-security/transaction';
import { permissions,rolePermissions,userRoles } from '../schema/rbac';
import { classrooms,classroomMembers } from '../schema/learning-workspaces';
import { organizations,organizationMemberships } from '../schema/organizations';
import { WorkspaceError,workspaceId,workspacePermissions } from './contract';
export type WorkspaceTransaction=Parameters<Parameters<typeof db.transaction>[0]>[0];
export type WorkspaceActor={id:string;authVersion:number};
export async function workspaceAccount(tx:WorkspaceTransaction,actor:WorkspaceActor,verified=false){const user=await activeAccount(tx,actor.id,actor.authVersion);if(verified&&(!user.emailVerifiedAt||!user.email))throw new WorkspaceError('Verify your email in account settings first.');return user;}
export async function hasWorkspacePermission(tx:WorkspaceTransaction,userId:string,key:string){const rows=await tx.select({id:permissions.id}).from(userRoles).innerJoin(rolePermissions,eq(userRoles.roleId,rolePermissions.roleId)).innerJoin(permissions,eq(permissions.id,rolePermissions.permissionId)).where(and(eq(userRoles.userId,userId),eq(permissions.key,key))).for('share');return rows.length>0;}
export async function requireWorkspacePermission(tx:WorkspaceTransaction,userId:string,key:string){if(!await hasWorkspacePermission(tx,userId,key))throw new WorkspaceError('This workspace requires a scoped staff permission.');}
export async function classroomAccess(tx:WorkspaceTransaction,actor:WorkspaceActor,id:unknown,owner=false,allowArchived=false){
 const [room]=await tx.select().from(classrooms).where(eq(classrooms.id,workspaceId(id))).for('update');
 if(!room||(room.archivedAt&&!(owner&&allowArchived)))throw new WorkspaceError('Classroom unavailable.');
 const [org]=await tx.select().from(organizations).where(eq(organizations.id,room.organizationId)).for('share');
 if(!org?.isActive||org.isArchived)throw new WorkspaceError('Classroom unavailable.');
 if(owner){await requireWorkspacePermission(tx,actor.id,workspacePermissions.educator);const [membership]=await tx.select().from(organizationMemberships).where(and(eq(organizationMemberships.organizationId,room.organizationId),eq(organizationMemberships.userId,actor.id),eq(organizationMemberships.status,'active'),eq(organizationMemberships.isOwner,true))).for('share');if(room.ownerId!==actor.id||!membership)throw new WorkspaceError('Classroom unavailable.');}
 else {const [member]=await tx.select().from(classroomMembers).where(and(eq(classroomMembers.classroomId,room.id),eq(classroomMembers.userId,actor.id)));if(!member)throw new WorkspaceError('Classroom unavailable.');}
 return room;
}
