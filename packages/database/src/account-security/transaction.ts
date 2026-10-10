import { and, eq } from 'drizzle-orm';
import { db } from '../client';
import { users } from '../schema/users';
import { AccountError } from './contract';
export type AccountTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export async function activeAccount(tx: AccountTransaction,userId:string,version?:number){
 if(!/^[0-9a-f-]{36}$/i.test(userId))throw new AccountError('UNAUTHENTICATED');
 const [user]=await tx.select().from(users).where(and(eq(users.id,userId),eq(users.isActive,true))).for('update');
 if(!user || (version!==undefined&&user.authVersion!==version))throw new AccountError('UNAUTHENTICATED');
 return user;
}
