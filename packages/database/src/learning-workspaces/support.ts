import { workspaceAudit } from './audit';
import { and,eq,desc,asc,sql,ilike,isNull } from 'drizzle-orm';
import { normalizeSupportQuery,supportSearchPattern,supportPriority,SUPPORT_PAGE_SIZE } from './support-query';
import { db } from '../client';
import { supportTickets,supportMessages } from '../schema/learning-workspaces';
import { users } from '../schema/users';
import { workspaceAccount,requireWorkspacePermission,hasWorkspacePermission,type WorkspaceActor,type WorkspaceTransaction } from './access';
import { workspacePermissions,workspaceText,workspaceId,supportCategory,WorkspaceError } from './contract';
async function ticketAccess(tx:WorkspaceTransaction,actor:WorkspaceActor,id:unknown,staff:boolean){if(staff)await requireWorkspacePermission(tx,actor.id,workspacePermissions.support);const [ticket]=await tx.select().from(supportTickets).where(and(eq(supportTickets.id,workspaceId(id)),staff?undefined:eq(supportTickets.userId,actor.id))).for('update');if(!ticket)throw new WorkspaceError('Ticket unavailable.');return ticket;}
export async function listSupportTickets(actor:WorkspaceActor,staff=false,options:Record<string,unknown>={}){
 const query=normalizeSupportQuery(options,staff);
 return db.transaction(async tx=>{
  await workspaceAccount(tx,actor);
  if(staff)await requireWorkspacePermission(tx,actor.id,workspacePermissions.support);
  const canSupport=await hasWorkspacePermission(tx,actor.id,workspacePermissions.support);
  const where=and(staff?undefined:eq(supportTickets.userId,actor.id),query.q?ilike(supportTickets.subject,supportSearchPattern(query.q)):undefined,
   query.status!=='all'?eq(supportTickets.status,query.status as 'open'|'replied'|'closed'):undefined,
   query.category!=='all'?eq(supportTickets.category,query.category):undefined,
   query.priority!=='all'?eq(supportTickets.priority,supportPriority(query.priority)):undefined,
   query.assignment==='mine'?eq(supportTickets.assigneeId,actor.id):query.assignment==='unassigned'?isNull(supportTickets.assigneeId):undefined);
  const [count]=await tx.select({total:sql<number>`count(*)::int`}).from(supportTickets).where(where);
  const total=count?.total??0;
  const pages=Math.max(1,Math.ceil(total/SUPPORT_PAGE_SIZE));
  const page=Math.min(query.page,pages);
  const order=query.sort==='priority'?[asc(sql`CASE ${supportTickets.priority} WHEN 'high' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END`),desc(supportTickets.updatedAt),desc(supportTickets.id)]:[desc(supportTickets.updatedAt),desc(supportTickets.id)];
  const tickets=await tx.select().from(supportTickets).where(where).orderBy(...order).limit(SUPPORT_PAGE_SIZE).offset((page-1)*SUPPORT_PAGE_SIZE);
  return {tickets,canSupport,total,pages,page,pageSize:SUPPORT_PAGE_SIZE,query:{...query,page}};
 },{isolationLevel:'repeatable read'});
}
export async function createSupportTicket(actor:WorkspaceActor,subject:unknown,category:unknown,body:unknown){return db.transaction(async tx=>{await workspaceAccount(tx,actor);const recent=await tx.select({id:supportTickets.id}).from(supportTickets).where(and(eq(supportTickets.userId,actor.id),sql`${supportTickets.createdAt}>now()-interval '1 day'`));if(recent.length>=5)throw new WorkspaceError('You can open up to five tickets per day.');const [ticket]=await tx.insert(supportTickets).values({userId:actor.id,subject:workspaceText(subject,'Subject'),category:supportCategory(category)}).returning();if(!ticket)throw new WorkspaceError('Unable to open ticket.');await tx.insert(supportMessages).values({ticketId:ticket.id,authorId:actor.id,body:workspaceText(body,'Message',10,4000)});await workspaceAudit(tx,actor,'support',ticket.id,'create');return {success:true,id:ticket.id};});}
export async function supportTicketDetail(actor:WorkspaceActor,id:string,staff=false){return db.transaction(async tx=>{await workspaceAccount(tx,actor);const ticket=await ticketAccess(tx,actor,id,staff);const messages=await tx.select({id:supportMessages.id,body:supportMessages.body,createdAt:supportMessages.createdAt,authorId:supportMessages.authorId}).from(supportMessages).where(eq(supportMessages.ticketId,ticket.id)).orderBy(asc(supportMessages.createdAt)).limit(200);return {ticket,messages:messages.map(m=>({id:m.id,body:m.body,createdAt:m.createdAt,from:m.authorId===ticket.userId?'You':'Support'}))};});}
export async function replySupportTicket(actor:WorkspaceActor,id:unknown,body:unknown,staff=false){return db.transaction(async tx=>{await workspaceAccount(tx,actor);const ticket=await ticketAccess(tx,actor,id,staff);if(ticket.status==='closed')throw new WorkspaceError('Reopen this ticket before replying.');const count=await tx.select({id:supportMessages.id}).from(supportMessages).where(eq(supportMessages.ticketId,ticket.id));if(count.length>=200)throw new WorkspaceError('Conversation limit reached; open a new ticket.');const recent=await tx.select({id:supportMessages.id}).from(supportMessages).where(and(eq(supportMessages.authorId,actor.id),sql`${supportMessages.createdAt}>now()-interval '1 hour'`));if(recent.length>=30)throw new WorkspaceError('Try again in an hour.');await tx.insert(supportMessages).values({ticketId:ticket.id,authorId:actor.id,body:workspaceText(body,'Message',10,4000)});await tx.update(supportTickets).set({status:staff?'replied':'open',updatedAt:new Date()}).where(eq(supportTickets.id,ticket.id));await workspaceAudit(tx,actor,'support',ticket.id,staff?'staff-update':'customer-update');return {success:true};});}
export async function setSupportStatus(actor:WorkspaceActor,id:unknown,status:unknown,staff=false){if(status!=='open'&&status!=='closed')throw new WorkspaceError('Invalid ticket status.');return db.transaction(async tx=>{await workspaceAccount(tx,actor);const ticket=await ticketAccess(tx,actor,id,staff);await tx.update(supportTickets).set({status,updatedAt:new Date()}).where(eq(supportTickets.id,ticket.id));await workspaceAudit(tx,actor,'support',ticket.id,staff?'staff-update':'customer-update');return {success:true};});}
export async function triageSupportTicket(actor:WorkspaceActor,id:unknown,priorityValue:unknown,assignment:unknown){
 const priority=supportPriority(priorityValue);
 if(assignment!=='keep'&&assignment!=='claim'&&assignment!=='release')throw new WorkspaceError('Choose a valid assignment action.');
 return db.transaction(async tx=>{
  await workspaceAccount(tx,actor);
  const ticket=await ticketAccess(tx,actor,id,true);
  if(assignment==='claim'&&ticket.assigneeId&&ticket.assigneeId!==actor.id){
   const [assigned]=await tx.select({active:users.isActive}).from(users).where(eq(users.id,ticket.assigneeId));
   if(assigned?.active&&await hasWorkspacePermission(tx,ticket.assigneeId,workspacePermissions.support))throw new WorkspaceError('This ticket is claimed by another operator.');
  }
  if(assignment==='release'&&ticket.assigneeId&&ticket.assigneeId!==actor.id)throw new WorkspaceError('Only the assigned operator can release this ticket.');
  await tx.update(supportTickets).set({priority,assigneeId:assignment==='claim'?actor.id:assignment==='release'?null:ticket.assigneeId,updatedAt:new Date()}).where(eq(supportTickets.id,ticket.id));
  await workspaceAudit(tx,actor,'support',ticket.id,'triage');
  return {success:true};
 });
}
