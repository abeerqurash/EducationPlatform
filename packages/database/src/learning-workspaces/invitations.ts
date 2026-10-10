import { workspaceAudit } from './audit';
import { and,eq,sql,desc } from 'drizzle-orm';
import { db } from '../client';
import { classroomMembers,learningInvites,parentLinks } from '../schema/learning-workspaces';
import { workspaceAccount,classroomAccess,type WorkspaceActor } from './access';
import { inviteEmail,newInvite,inviteHash,usableInvite,WorkspaceError,workspaceId } from './contract';
export async function createLearningInvite(actor:WorkspaceActor,kind:unknown,emailValue:unknown,classroomId?:unknown){return db.transaction(async tx=>{
 const user=await workspaceAccount(tx,actor,true);if(kind!=='parent'&&kind!=='classroom')throw new WorkspaceError('Invalid invitation type.');
 const room=kind==='classroom'?await classroomAccess(tx,actor,classroomId,true):null;const email=inviteEmail(emailValue);if(email===user.email?.toLowerCase())throw new WorkspaceError('Invite a different account.');
 const recent=await tx.select({id:learningInvites.id}).from(learningInvites).where(and(eq(learningInvites.creatorId,actor.id),sql`${learningInvites.createdAt}>now()-interval '1 hour'`));if(recent.length>=20)throw new WorkspaceError('Try again in an hour.');
 const links=kind==='parent'?await tx.select({id:parentLinks.id}).from(parentLinks).where(eq(parentLinks.studentId,actor.id)):[];if(links.length>=5)throw new WorkspaceError('You can share with up to five accounts.');
 const fresh=newInvite();const [invite]=await tx.insert(learningInvites).values({kind,creatorId:actor.id,classroomId:room?.id??null,email,tokenHash:fresh.tokenHash,expiresAt:new Date(Date.now()+7*86400000)}).returning({id:learningInvites.id});if(!invite)throw new WorkspaceError('Unable to create invitation.');await workspaceAudit(tx,actor,'invite',invite.id,'create');return {success:true,id:invite.id,token:fresh.token};
});}
export async function acceptLearningInvite(actor:WorkspaceActor,token:unknown){const hash=inviteHash(token);return db.transaction(async tx=>{
 const user=await workspaceAccount(tx,actor,true);
 // Serialize all acceptance/revocation for the same invitation before opening its classroom.
 const { users:accounts }=await import('../schema/users');const [candidate]=await tx.select().from(learningInvites).where(eq(learningInvites.tokenHash,hash));if(!candidate)throw new WorkspaceError('Invitation unavailable.');const [creator]=await tx.select({active:accounts.isActive}).from(accounts).where(eq(accounts.id,candidate.creatorId));if(!creator?.active)throw new WorkspaceError('Invitation unavailable.');
 if(candidate.kind==='classroom'&&candidate.classroomId)await classroomAccess(tx,{id:candidate.creatorId,authVersion:0},candidate.classroomId,true);
 const [invite]=await tx.select().from(learningInvites).where(eq(learningInvites.tokenHash,hash)).for('update');if(!invite)throw new WorkspaceError('Invitation unavailable.');usableInvite(invite,user.email??'');if(invite.creatorId===actor.id)throw new WorkspaceError('Invitation unavailable.');
 if(invite.kind==='classroom'){
  // Same classroom lock as removals and submissions; owner permission is rechecked at acceptance.
  if(!invite.classroomId)throw new WorkspaceError('Invitation unavailable.');await classroomAccess(tx,{id:invite.creatorId,authVersion:0},invite.classroomId,true);
  const count=await tx.select({id:classroomMembers.id}).from(classroomMembers).where(eq(classroomMembers.classroomId,invite.classroomId));if(count.length>=100)throw new WorkspaceError('Classroom is full.');
  await tx.insert(classroomMembers).values({classroomId:invite.classroomId,userId:actor.id}).onConflictDoNothing();
 }else{
  // Lock the student's account so revocation and creation cannot race into a new sharing grant.
  const { users }=await import('../schema/users');const [student]=await tx.select().from(users).where(and(eq(users.id,invite.creatorId),eq(users.isActive,true)));if(!student?.emailVerifiedAt)throw new WorkspaceError('Invitation unavailable.');
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${`parent-links:${invite.creatorId}`},0))`);const existing=await tx.select({id:parentLinks.id}).from(parentLinks).where(eq(parentLinks.studentId,invite.creatorId));if(existing.length>=5)throw new WorkspaceError('Sharing limit reached.');await tx.insert(parentLinks).values({studentId:invite.creatorId,parentId:actor.id}).onConflictDoNothing();
 }
 await tx.update(learningInvites).set({usedAt:new Date()}).where(eq(learningInvites.id,invite.id));await workspaceAudit(tx,actor,'invite',invite.id,'accept');return {success:true,kind:invite.kind};
});}
export async function revokeLearningInvite(actor:WorkspaceActor,id:unknown){return db.transaction(async tx=>{await workspaceAccount(tx,actor);const [invite]=await tx.select().from(learningInvites).where(and(eq(learningInvites.id,workspaceId(id)),eq(learningInvites.creatorId,actor.id))).for('update');if(!invite)throw new WorkspaceError('Invitation unavailable.');await tx.update(learningInvites).set({revokedAt:new Date()}).where(eq(learningInvites.id,invite.id));await workspaceAudit(tx,actor,'invite',invite.id,'revoke');return {success:true};});}
export async function listParentInvites(actor:WorkspaceActor){return db.transaction(async tx=>{await workspaceAccount(tx,actor);return tx.select({id:learningInvites.id,email:learningInvites.email,expiresAt:learningInvites.expiresAt,usedAt:learningInvites.usedAt,revokedAt:learningInvites.revokedAt}).from(learningInvites).where(and(eq(learningInvites.creatorId,actor.id),eq(learningInvites.kind,'parent'))).orderBy(desc(learningInvites.createdAt)).limit(50);});}
