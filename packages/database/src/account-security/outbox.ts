import { and, eq, lte } from 'drizzle-orm';
import { db } from '../client';
import { accountEmailOutbox } from '../schema/account-security';
import { sealPayload, openPayload } from './crypto';
import { type MailKind, retryDelay } from './contract';
import type { AccountTransaction } from './transaction';
import { accountLink, parseAccountMail } from './mail/templates';
import { mailSettings, type MailSettings } from './mail/config';
import { deliverAccountMail } from './mail';
import { DeliveryError } from './mail/errors';

export async function cancelQueuedMail(tx:AccountTransaction,userId:string,kind:MailKind){await tx.update(accountEmailOutbox).set({status:'cancelled',encryptedPayload:null}).where(and(eq(accountEmailOutbox.userId,userId),eq(accountEmailOutbox.kind,kind),eq(accountEmailOutbox.status,'pending')));}
export async function queueAccountMail(tx:AccountTransaction,userId:string,email:string,kind:MailKind,token:string,expiresAt:Date,settings:MailSettings){
 await tx.insert(accountEmailOutbox).values({userId,kind,expiresAt,encryptedPayload:sealPayload({to:email,kind,url:accountLink(settings.origin,kind,token)},settings.secret)});
}
export async function processAccountOutbox(limit=20,settings=mailSettings(),deliver=deliverAccountMail){
 if(settings.transport==='disabled')throw new Error('Email delivery is disabled. Configure EMAIL_TRANSPORT before running the worker.');
 if(!Number.isInteger(limit)||limit<1||limit>100)throw new Error('Worker limit must be 1–100.');
 const summary={sent:0,retried:0,failed:0,cancelled:0};
 for(let i=0;i<limit;i++){
  const processed=await db.transaction(async tx=>{
   const now=new Date();
   const [row]=await tx.select().from(accountEmailOutbox).where(and(eq(accountEmailOutbox.status,'pending'),lte(accountEmailOutbox.availableAt,now))).orderBy(accountEmailOutbox.createdAt).limit(1).for('update',{skipLocked:true});
   if(!row)return false;
   if(row.expiresAt<=now||!row.encryptedPayload){await tx.update(accountEmailOutbox).set({status:'cancelled',encryptedPayload:null}).where(eq(accountEmailOutbox.id,row.id));summary.cancelled++;return true;}
   const attempts=row.attempts+1;
   try{
    const mail=parseAccountMail(openPayload(row.encryptedPayload,settings.secret));
    const providerId=await deliver(row.id,mail,settings);
    await tx.update(accountEmailOutbox).set({status:'sent',sentAt:new Date(),encryptedPayload:null,attempts,providerId,errorCode:null}).where(eq(accountEmailOutbox.id,row.id));summary.sent++;
   }catch(error){
    const retry=error instanceof DeliveryError&&error.retryable&&attempts<5;
    await tx.update(accountEmailOutbox).set({status:retry?'pending':'failed',encryptedPayload:retry?row.encryptedPayload:null,attempts,availableAt:new Date(now.getTime()+retryDelay(attempts)),errorCode:error instanceof DeliveryError?error.code:'PAYLOAD_OR_CONFIGURATION'}).where(eq(accountEmailOutbox.id,row.id));
    if(retry)summary.retried++;else summary.failed++;
   }
   return true;
  });
  if(!processed)break;
 }
 return summary;
}
