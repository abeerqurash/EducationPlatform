import { and, eq, isNull, sql } from 'drizzle-orm';
import { db } from '../client';
import { users } from '../schema/users';
import { passwordResetTokens } from '../schema/security-tokens';
import { passwordSchema } from '@education/auth/validation';
import { hashPassword, verifyPassword } from '@education/auth/password';
import { AccountError } from './contract';
import { activeAccount } from './transaction';
import { recordSecurityEvent } from './events';
import { cancelQueuedMail } from './outbox';
import { takeRateLimit } from './rate-limit';
import { mailSettings } from './mail/config';

export async function changeAccountPassword(userId:string,version:number,input:unknown){
 const values=input as Record<string,unknown>|null;
 if(!values||typeof values.currentPassword!=='string'||values.currentPassword.length>128||values.password!==values.confirmPassword||!passwordSchema.safeParse(values.password).success)throw new AccountError('INVALID_INPUT');
 const password=values.password as string;
 await takeRateLimit('password-change',userId,mailSettings().secret,5,15);
 const passwordHash=await hashPassword(password);
 await db.transaction(async tx=>{
  const user=await activeAccount(tx,userId,version);
  if(!user.passwordHash||!await verifyPassword(user.passwordHash,values.currentPassword as string))throw new AccountError('WRONG_PASSWORD');
  const now=new Date();await tx.update(users).set({passwordHash,passwordChangedAt:now,authVersion:sql`${users.authVersion}+1`,updatedAt:now}).where(eq(users.id,userId));
  await tx.update(passwordResetTokens).set({usedAt:now}).where(and(eq(passwordResetTokens.userId,userId),isNull(passwordResetTokens.usedAt)));
  await cancelQueuedMail(tx,userId,'reset');await recordSecurityEvent(tx,userId,'password_changed');
 });return {success:true as const};
}
