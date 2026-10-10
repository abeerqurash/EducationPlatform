import { AccountError } from '../contract';
export type MailSettings={transport:'disabled'|'file'|'resend';origin:string;secret:string;from?:string;apiKey?:string;directory?:string};
export function mailSettings(env:Record<string,string|undefined>=process.env):MailSettings {
 const transport=env.EMAIL_TRANSPORT??'disabled';if(!['disabled','file','resend'].includes(transport))throw new AccountError('DELIVERY_UNAVAILABLE');
 const secret=env.EMAIL_OUTBOX_SECRET??env.AUTH_SECRET??'';
 const value=env.AUTH_EMAIL_ORIGIN??env.NEXT_PUBLIC_SITE_URL??'http://localhost:3000';
 const url=new URL(value);
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw new AccountError('DELIVERY_UNAVAILABLE');
 const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname);
 if(transport==='file'&&!local)throw new AccountError('DELIVERY_UNAVAILABLE');
 if(transport==='resend'&&(!env.RESEND_API_KEY||!env.EMAIL_FROM||url.protocol!=='https:'||local))throw new AccountError('DELIVERY_UNAVAILABLE');
 if(transport!=='disabled'&&secret.length<32)throw new AccountError('DELIVERY_UNAVAILABLE');
 return {transport:transport as MailSettings['transport'],origin:url.origin,secret,from:env.EMAIL_FROM,apiKey:env.RESEND_API_KEY,directory:env.EMAIL_CAPTURE_DIRECTORY};
}
