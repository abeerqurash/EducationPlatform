import { eq, sql } from 'drizzle-orm';
import { db } from '../client';
import { users } from '../schema/users';
import { verifyPassword } from '@education/auth/password';
import { activeAccount } from './transaction';
import { AccountError, sessionIsCurrent } from './contract';
import { recordSecurityEvent } from './events';
import { mailSettings } from './mail/config';
import { takeRateLimit } from './rate-limit';

export async function validateAccountSession(userId:unknown,version:unknown){if(typeof userId!=='string'||!/^[0-9a-f-]{36}$/i.test(userId))return false;const [user]=await db.select({isActive:users.isActive,authVersion:users.authVersion}).from(users).where(eq(users.id,userId));return sessionIsCurrent(user,version);}
export async function revokeAccountSessions(userId:string,version:number,password:unknown){
 if(typeof password!=='string'||!password||password.length>128)throw new AccountError('INVALID_INPUT');
 await takeRateLimit('session-revoke',userId,mailSettings().secret,5,15);
 await db.transaction(async tx=>{const user=await activeAccount(tx,userId,version);if(!user.passwordHash||!await verifyPassword(user.passwordHash,password))throw new AccountError('WRONG_PASSWORD');await tx.update(users).set({authVersion:sql`${users.authVersion}+1`,updatedAt:new Date()}).where(eq(users.id,userId));await recordSecurityEvent(tx,userId,'sessions_revoked');});return {success:true as const};
}
