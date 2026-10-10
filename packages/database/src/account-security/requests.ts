import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../client';
import { users } from '../schema/users';
import { emailVerificationTokens, passwordResetTokens } from '../schema/security-tokens';
import { normalizedEmailSchema } from '@education/auth/validation';
import { createExpiringToken } from '@education/auth/tokens';
import { AccountError, type MailKind } from './contract';
import { takeRateLimit } from './rate-limit';
import { mailSettings } from './mail/config';
import { queueAccountMail, cancelQueuedMail } from './outbox';
import { recordSecurityEvent } from './events';

export async function requestAccountEmail(kind:MailKind,input:unknown){
 const email=normalizedEmailSchema.safeParse(input);if(!email.success)throw new AccountError('INVALID_INPUT');
 const settings=mailSettings();if(settings.transport==='disabled')throw new AccountError('DELIVERY_UNAVAILABLE');
 await takeRateLimit(`email-${kind}`,email.data,settings.secret,3);
 await db.transaction(async tx=>{
  const [user]=await tx.select().from(users).where(and(eq(users.email,email.data),eq(users.isActive,true))).for('update');
  if(!user||!user.email||(kind==='verification'&&user.emailVerifiedAt)||(kind==='reset'&&!user.passwordHash))return;
  const table=kind==='verification'?emailVerificationTokens:passwordResetTokens;
  const token=createExpiringToken(kind==='verification'?24*60:30);
  await tx.update(table).set({usedAt:new Date()}).where(and(eq(table.userId,user.id),isNull(table.usedAt)));
  await cancelQueuedMail(tx,user.id,kind);
  await tx.insert(table).values({userId:user.id,tokenHash:token.tokenHash,expiresAt:token.expiresAt});
  await queueAccountMail(tx,user.id,user.email,kind,token.token,token.expiresAt,settings);
  await recordSecurityEvent(tx,user.id,kind==='verification'?'verification_requested':'reset_requested');
 });
 return {success:true as const};
}
