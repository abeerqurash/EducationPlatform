import { sql } from 'drizzle-orm';
import { pgTable, uuid, text, timestamp, jsonb, integer, uniqueIndex, index, check } from 'drizzle-orm/pg-core';
import { users } from './users';
import { organizations } from './organizations';
import { practiceAttempts } from './practice-attempts';
const time = () => timestamp('created_at', { withTimezone:true }).defaultNow().notNull();
export const classrooms = pgTable('learning_classrooms', {
 id:uuid('id').defaultRandom().primaryKey(), organizationId:uuid('organization_id').notNull().references(()=>organizations.id,{onDelete:'cascade'}),
 ownerId:uuid('owner_id').notNull().references(()=>users.id,{onDelete:'restrict'}), title:text('title').notNull(), createdAt:time(), archivedAt:timestamp('archived_at',{withTimezone:true}),
},t=>[index('learning_classrooms_owner_idx').on(t.ownerId),check('learning_classroom_title',sql`length(${t.title}) BETWEEN 3 AND 160`)]);
export const classroomMembers = pgTable('learning_classroom_members', {
 id:uuid('id').defaultRandom().primaryKey(), classroomId:uuid('classroom_id').notNull().references(()=>classrooms.id,{onDelete:'cascade'}),
 userId:uuid('user_id').notNull().references(()=>users.id,{onDelete:'cascade'}),createdAt:time(),
},t=>[uniqueIndex('learning_members_class_user').on(t.classroomId,t.userId),index('learning_members_user').on(t.userId)]);
export const learningInvites = pgTable('learning_invites', {
 id:uuid('id').defaultRandom().primaryKey(), kind:text('kind').$type<'classroom'|'parent'>().notNull(), creatorId:uuid('creator_id').notNull().references(()=>users.id,{onDelete:'cascade'}),
 classroomId:uuid('classroom_id').references(()=>classrooms.id,{onDelete:'cascade'}), email:text('email').notNull(), tokenHash:text('token_hash').notNull(),createdAt:time(),
 expiresAt:timestamp('expires_at',{withTimezone:true}).notNull(), usedAt:timestamp('used_at',{withTimezone:true}), revokedAt:timestamp('revoked_at',{withTimezone:true}),
},t=>[uniqueIndex('learning_invites_hash').on(t.tokenHash),index('learning_invites_creator').on(t.creatorId),check('learning_invite_scope',sql`(${t.kind}='parent' AND ${t.classroomId} IS NULL) OR (${t.kind}='classroom' AND ${t.classroomId} IS NOT NULL)`)]);
export const parentLinks = pgTable('learning_parent_links', {
 id:uuid('id').defaultRandom().primaryKey(),studentId:uuid('student_id').notNull().references(()=>users.id,{onDelete:'cascade'}),parentId:uuid('parent_id').notNull().references(()=>users.id,{onDelete:'cascade'}),createdAt:time(),
},t=>[uniqueIndex('learning_parent_pair').on(t.studentId,t.parentId),index('learning_parent_recipient').on(t.parentId),check('learning_parent_distinct',sql`${t.studentId}<>${t.parentId}`)]);
export const classroomAssignments = pgTable('learning_assignments', {
 id:uuid('id').defaultRandom().primaryKey(),classroomId:uuid('classroom_id').notNull().references(()=>classrooms.id,{onDelete:'cascade'}),title:text('title').notNull(),exam:text('exam').$type<'SAT'|'ACT'>().notNull(),
 revisionIds:jsonb('revision_ids').$type<string[]>().notNull(),dueAt:timestamp('due_at',{withTimezone:true}).notNull(),createdAt:time(),closedAt:timestamp('closed_at',{withTimezone:true}),
},t=>[index('learning_assignments_class').on(t.classroomId),check('learning_assignment_exam',sql`${t.exam} IN ('SAT','ACT')`),check('learning_assignment_questions',sql`jsonb_typeof(${t.revisionIds})='array' AND jsonb_array_length(${t.revisionIds}) BETWEEN 1 AND 20`)]);
export const assignmentWork = pgTable('learning_assignment_work', {
 id:uuid('id').defaultRandom().primaryKey(),assignmentId:uuid('assignment_id').notNull().references(()=>classroomAssignments.id,{onDelete:'cascade'}),userId:uuid('user_id').notNull().references(()=>users.id,{onDelete:'cascade'}),
 startedAt:timestamp('started_at',{withTimezone:true}).defaultNow().notNull(),draftAnswers:jsonb('draft_answers').$type<{questionId:string;choice:number}[]>().default([]).notNull(),submittedAt:timestamp('submitted_at',{withTimezone:true}),
 attemptId:uuid('attempt_id').references(()=>practiceAttempts.id,{onDelete:'set null'}),percentage:integer('percentage'),
},t=>[uniqueIndex('learning_work_assignment_user').on(t.assignmentId,t.userId),check('learning_work_score',sql`${t.percentage} IS NULL OR (${t.submittedAt} IS NOT NULL AND ${t.percentage} BETWEEN 0 AND 100)`)]);
export const supportTickets = pgTable('support_tickets', {
 id:uuid('id').defaultRandom().primaryKey(),userId:uuid('user_id').notNull().references(()=>users.id,{onDelete:'cascade'}),subject:text('subject').notNull(),priority:text('priority').$type<'low'|'normal'|'high'>().default('normal').notNull(),assigneeId:uuid('assignee_id').references(()=>users.id,{onDelete:'set null'}),category:text('category').notNull(),status:text('status').$type<'open'|'replied'|'closed'>().default('open').notNull(),createdAt:time(),updatedAt:timestamp('updated_at',{withTimezone:true}).defaultNow().notNull(),
},t=>[index('support_tickets_user').on(t.userId,t.createdAt),index('support_tickets_updated_idx').on(t.updatedAt,t.id),index('support_tickets_user_updated_idx').on(t.userId,t.updatedAt,t.id),index('support_tickets_assignee_updated_idx').on(t.assigneeId,t.updatedAt),check('support_ticket_priority',sql`${t.priority} IN ('low','normal','high')`),check('support_ticket_status',sql`${t.status} IN ('open','replied','closed')`),check('support_ticket_category',sql`${t.category} IN ('technical','account','content','accessibility')`)]);
export const supportMessages = pgTable('support_messages', {
 id:uuid('id').defaultRandom().primaryKey(),ticketId:uuid('ticket_id').notNull().references(()=>supportTickets.id,{onDelete:'cascade'}),authorId:uuid('author_id').notNull().references(()=>users.id,{onDelete:'restrict'}),body:text('body').notNull(),createdAt:time(),
},t=>[index('support_messages_ticket').on(t.ticketId,t.createdAt),check('support_message_body',sql`length(${t.body}) BETWEEN 10 AND 4000`)]);
