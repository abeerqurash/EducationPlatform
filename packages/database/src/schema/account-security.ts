import { check, index, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const accountRateLimits = pgTable('account_rate_limits', {
  key: varchar('key', {length:64}).primaryKey(),
  count: integer('count').notNull().default(0),
  expiresAt: timestamp('expires_at',{withTimezone:true}).notNull(),
}, t=>[index('account_rate_limits_expiry_idx').on(t.expiresAt),check('account_rate_limits_count_check',sql`${t.count} >= 0`)]);

export const accountSecurityEvents = pgTable('account_security_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(()=>users.id,{onDelete:'cascade'}),
  kind: varchar('kind',{length:50}).notNull(),
  createdAt: timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
}, t=>[index('account_security_events_user_time_idx').on(t.userId,t.createdAt),check('account_security_events_kind_check',sql`${t.kind} IN ('registered','verification_requested','email_verified','reset_requested','password_reset','password_changed','sessions_revoked')`)]);

export const accountEmailOutbox = pgTable('account_email_outbox', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(()=>users.id,{onDelete:'cascade'}),
  kind: varchar('kind',{length:30}).notNull(),
  encryptedPayload: text('encrypted_payload'),
  status: varchar('status',{length:20}).notNull().default('pending'),
  attempts: integer('attempts').notNull().default(0),
  availableAt: timestamp('available_at',{withTimezone:true}).defaultNow().notNull(),
  expiresAt: timestamp('expires_at',{withTimezone:true}).notNull(),
  createdAt: timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
  sentAt: timestamp('sent_at',{withTimezone:true}),
  errorCode: varchar('error_code',{length:50}),
  providerId: varchar('provider_id',{length:200}),
}, t=>[index('account_email_outbox_pending_idx').on(t.status,t.availableAt),index('account_email_outbox_user_idx').on(t.userId),check('account_email_outbox_status_check',sql`${t.status} IN ('pending','sent','failed','cancelled')`),check('account_email_outbox_kind_check',sql`${t.kind} IN ('verification','reset')`),check('account_email_outbox_attempts_check',sql`${t.attempts} BETWEEN 0 AND 5`)]);
