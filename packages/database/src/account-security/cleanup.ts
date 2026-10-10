import { and, eq, lt } from 'drizzle-orm';
import { db } from '../client';
import { accountRateLimits,accountEmailOutbox } from '../schema/account-security';
import { emailVerificationTokens,passwordResetTokens } from '../schema/security-tokens';
export async function cleanupAccountSecurity(now=new Date()){
 const tokenCutoff=new Date(now.getTime()-7*24*60*60*1000);
 return db.transaction(async tx=>{
  const limits=await tx.delete(accountRateLimits).where(lt(accountRateLimits.expiresAt,now)).returning({key:accountRateLimits.key});
  const verify=await tx.delete(emailVerificationTokens).where(lt(emailVerificationTokens.expiresAt,tokenCutoff)).returning({id:emailVerificationTokens.id});
  const reset=await tx.delete(passwordResetTokens).where(lt(passwordResetTokens.expiresAt,tokenCutoff)).returning({id:passwordResetTokens.id});
  const cancelled=await tx.update(accountEmailOutbox).set({status:'cancelled',encryptedPayload:null}).where(and(eq(accountEmailOutbox.status,'pending'),lt(accountEmailOutbox.expiresAt,now))).returning({id:accountEmailOutbox.id});
  return {rateLimitsRemoved:limits.length,expiredTokensRemoved:verify.length+reset.length,expiredEmailsCancelled:cancelled.length};
 });
}
