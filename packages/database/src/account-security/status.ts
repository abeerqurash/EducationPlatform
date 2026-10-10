import { desc, eq } from 'drizzle-orm';
import { db } from '../client';
import { users } from '../schema/users';
import { accountSecurityEvents } from '../schema/account-security';
import { AccountError } from './contract';
export async function getAccountSecurity(userId:string){
 const [user]=await db.select({id:users.id,email:users.email,emailVerifiedAt:users.emailVerifiedAt,passwordChangedAt:users.passwordChangedAt,lastLoginAt:users.lastLoginAt,createdAt:users.createdAt,isActive:users.isActive}).from(users).where(eq(users.id,userId));
 if(!user?.isActive)throw new AccountError('UNAUTHENTICATED');
 const events=await db.select({id:accountSecurityEvents.id,kind:accountSecurityEvents.kind,createdAt:accountSecurityEvents.createdAt}).from(accountSecurityEvents).where(eq(accountSecurityEvents.userId,userId)).orderBy(desc(accountSecurityEvents.createdAt)).limit(50);
 return {account:user,events};
}
