import { db } from '../client';
import { users } from '../schema/users';
import { emailVerificationTokens } from '../schema/security-tokens';
import { registerSchema } from '@education/auth/validation';
import { hashPassword } from '@education/auth/password';
import { createExpiringToken } from '@education/auth/tokens';
import { AccountError } from './contract';
import { takeRateLimit } from './rate-limit';
import { mailSettings } from './mail/config';
import { queueAccountMail } from './outbox';
import { recordSecurityEvent } from './events';

export async function registerAccount(input:unknown){
 const parsed=registerSchema.safeParse(input);if(!parsed.success)throw new AccountError('INVALID_INPUT');
 const settings=mailSettings();
 await takeRateLimit('register',parsed.data.email,settings.secret,5);
 const passwordHash=await hashPassword(parsed.data.password);
 return db.transaction(async tx=>{
  const [user]=await tx.insert(users).values({name:parsed.data.name,email:parsed.data.email,passwordHash,role:'student',isActive:true}).onConflictDoNothing({target:users.email}).returning({id:users.id,email:users.email});
  if(!user)return {success:true as const,emailQueued:settings.transport!=='disabled'};
  await recordSecurityEvent(tx,user.id,'registered');
  if(settings.transport!=='disabled'&&user.email){const token=createExpiringToken(24*60);await tx.insert(emailVerificationTokens).values({userId:user.id,tokenHash:token.tokenHash,expiresAt:token.expiresAt});await queueAccountMail(tx,user.id,user.email,'verification',token.token,token.expiresAt,settings);}
  return {success:true as const,emailQueued:settings.transport!=='disabled'};
 });
}
