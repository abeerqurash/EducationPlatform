import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAccountMail, type AccountMail } from './templates';
import type { MailSettings } from './config';
export async function captureMail(id:string,mail:AccountMail,settings:MailSettings){
 if(!/^[0-9a-f-]{36}$/i.test(id))throw new Error('Invalid mail ID');
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../../..');
 const allowed=path.join(root,'tmp','account-email-capture');
 // Explicit local CLI capture only; these ignored files are not deployment assets.
 const directory=path.resolve(/*turbopackIgnore: true*/ settings.directory??allowed);
 if(directory!==allowed)throw new Error('Local email capture must use the ignored tmp/account-email-capture directory.');
 await mkdir(directory,{recursive:true});
 await writeFile(path.join(directory,`${id}.json`),JSON.stringify(renderAccountMail(mail),null,2),{mode:0o600});
 return `file:${id}`;
}
