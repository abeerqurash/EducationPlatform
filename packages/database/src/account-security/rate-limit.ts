import { createHmac } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { db } from '../client';
import { AccountError } from './contract';
export function rateKey(scope:string,identity:string,secret:string){if(secret.length<32)throw new Error('Account security requires a secret.');return createHmac('sha256',secret).update(scope+'\0'+identity.toLowerCase().trim()).digest('hex');}
export async function takeRateLimit(scope:string,identity:string,secret:string,max:number,windowMinutes=60){
 const key=rateKey(scope,identity,secret);const now=new Date();const expiry=new Date(now.getTime()+windowMinutes*60000);
 const rows=await db.execute<{count:number}>(sql`INSERT INTO account_rate_limits (key,count,expires_at) VALUES (${key},1,${expiry.toISOString()}::timestamptz)
 ON CONFLICT (key) DO UPDATE SET count=CASE WHEN account_rate_limits.expires_at <= ${now.toISOString()}::timestamptz THEN 1 ELSE account_rate_limits.count + 1 END,
 expires_at=CASE WHEN account_rate_limits.expires_at <= ${now.toISOString()}::timestamptz THEN EXCLUDED.expires_at ELSE account_rate_limits.expires_at END
 RETURNING count`);
 if(!rows[0]||rows[0].count>max)throw new AccountError('RATE_LIMITED');
}
