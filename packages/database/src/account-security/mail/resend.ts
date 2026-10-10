import type { MailSettings } from './config';
import { renderAccountMail, type AccountMail } from './templates';
import { DeliveryError } from './errors';
export async function sendResend(id:string,mail:AccountMail,settings:MailSettings,fetcher:typeof fetch=fetch){
 const rendered=renderAccountMail(mail);
 let response:Response;try{response=await fetcher('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${settings.apiKey}`,'Content-Type':'application/json','Idempotency-Key':`account-${id}`},body:JSON.stringify({from:settings.from,to:[rendered.to],subject:rendered.subject,text:rendered.text}),signal:AbortSignal.timeout(10000)});}catch{throw new DeliveryError('NETWORK',true);}
 if(!response.ok)throw new DeliveryError(`HTTP_${response.status}`,response.status===429||response.status>=500);
 const data=await response.json() as {id?:unknown};if(typeof data.id!=='string'||data.id.length>200)throw new DeliveryError('PROVIDER_RESPONSE',true);
 return data.id;
}
