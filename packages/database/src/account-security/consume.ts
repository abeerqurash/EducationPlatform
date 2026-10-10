import { and, eq, isNull, sql } from 'drizzle-orm';
import { db } from '../client';
import { users } from '../schema/users';
import { emailVerificationTokens, passwordResetTokens } from '../schema/security-tokens';
import { hashToken } from '@education/auth/tokens';
import { hashPassword } from '@education/auth/password';
import { resetPasswordSchema } from '@education/auth/validation';
import { AccountError, usableToken, validAccountToken } from './contract';
import { activeAccount } from './transaction';
import { recordSecurityEvent } from './events';
import { cancelQueuedMail } from './outbox';

export async function verifyAccountEmail(token:unknown){
 if(!validAccountToken(token))throw new AccountError('INVALID_LINK');
 const tokenHash=hashToken(token);
 return db.transaction(async tx=>{
  const [candidate]=await tx.select().from(emailVerificationTokens).where(eq(emailVerificationTokens.tokenHash,tokenHash));
  if(!candidate)throw new AccountError('INVALID_LINK');
  const user=await activeAccount(tx,candidate.userId);
  const [row]=await tx.select().from(emailVerificationTokens).where(eq(emailVerificationTokens.id,candidate.id)).for('update');
  if(!row||!usableToken(row))throw new AccountError('INVALID_LINK');
  const now=new Date();
  await tx.update(emailVerificationTokens).set({usedAt:now}).where(and(eq(emailVerificationTokens.userId,user.id),isNull(emailVerificationTokens.usedAt)));
  await tx.update(users).set({emailVerifiedAt:user.emailVerifiedAt??now,updatedAt:now}).where(eq(users.id,user.id));
  await cancelQueuedMail(tx,user.id,'verification');await recordSecurityEvent(tx,user.id,'email_verified');
  return {success:true as const};
 });
}
export async function resetAccountPassword(input:unknown){
 const parsed=resetPasswordSchema.safeParse(input);if(!parsed.success)throw new AccountError('INVALID_INPUT');
 if(!validAccountToken(parsed.data.token))throw new AccountError('INVALID_LINK');
 const tokenHash=hashToken(parsed.data.token);
 // Reject unknown links before spending password-hash work. Transaction rechecks expiry/replay.
 const [candidate]=await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.tokenHash,tokenHash));
 if(!candidate||!usableToken(candidate))throw new AccountError('INVALID_LINK');
 const passwordHash=await hashPassword(parsed.data.password);
 return db.transaction(async tx=>{
  const user=await activeAccount(tx,candidate.userId);
  const [row]=await tx.select().from(passwordResetTokens).where(eq(passwordResetTokens.id,candidate.id)).for('update');
  if(!row||!usableToken(row))throw new AccountError('INVALID_LINK');
  const now=new Date();
  await tx.update(passwordResetTokens).set({usedAt:now}).where(and(eq(passwordResetTokens.userId,user.id),isNull(passwordResetTokens.usedAt)));
  await tx.update(users).set({passwordHash,passwordChangedAt:now,authVersion:sql`${users.authVersion}+1`,updatedAt:now}).where(eq(users.id,user.id));
  await cancelQueuedMail(tx,user.id,'reset');await recordSecurityEvent(tx,user.id,'password_reset');
  return {success:true as const};
 });
}
