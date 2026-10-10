import { AccountError } from '../contract';
import type { MailSettings } from './config';
import type { AccountMail } from './templates';
import { captureMail } from './file';
import { sendResend } from './resend';
export async function deliverAccountMail(id:string,mail:AccountMail,settings:MailSettings){if(settings.transport==='disabled')throw new AccountError('DELIVERY_UNAVAILABLE');return settings.transport==='file'?captureMail(id,mail,settings):sendResend(id,mail,settings);}
