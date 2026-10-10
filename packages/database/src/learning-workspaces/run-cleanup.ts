import { and,or,sql } from 'drizzle-orm';
import { db,client } from '../client';
import { learningInvites } from '../schema/learning-workspaces';
/** Explicit maintenance command; it does not remove memberships, assignments, links, or support history. */
try{const removed=await db.delete(learningInvites).where(and(sql`${learningInvites.createdAt}<now()-interval '30 days'`,or(sql`${learningInvites.expiresAt}<now()`,sql`${learningInvites.usedAt} IS NOT NULL`,sql`${learningInvites.revokedAt} IS NOT NULL`))).returning({id:learningInvites.id});console.log({expiredInvitationRecordsRemoved:removed.length});}catch{console.error('Invitation cleanup failed; check migration and connectivity.');process.exitCode=1;}finally{await client.end();}
