import { sql } from 'drizzle-orm';
import { db,client } from '../client';
import {mailSettings} from './mail/config';
try{
 const settings=mailSettings();
 const schema=await db.execute<{outbox:boolean;version:boolean}>(sql`SELECT to_regclass('public.account_email_outbox') IS NOT NULL AS outbox, EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='auth_version') AS version`);
 const ready=!!schema[0]?.outbox&&!!schema[0]?.version;
 console.log({migrationInstalled:ready,transport:settings.transport,origin:settings.origin,encryptionSecretConfigured:settings.secret.length>=32,liveEmailEnabled:settings.transport==='resend'});
 if(!ready||settings.secret.length<32)process.exitCode=1;
}catch{console.error('Account security configuration could not be validated. Check migration and documented environment settings.');process.exitCode=1;}finally{await client.end();}
