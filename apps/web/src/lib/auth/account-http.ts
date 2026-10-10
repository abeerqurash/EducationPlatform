import 'server-only';
import { isIP } from 'node:net';
import { AccountError } from '@education/database/account-security/contract';
import { takeRateLimit } from '../../../../../packages/database/src/account-security/rate-limit';
import { mailSettings } from '../../../../../packages/database/src/account-security/mail/config';
import { readAccountBody } from '../../../../../packages/database/src/account-security/http';
import { auth } from '@/auth';
const headers={'Cache-Control':'no-store','Referrer-Policy':'no-referrer'};
export async function accountJson(request:Request){
 const allowed=new Set([new URL(request.url).origin,...[process.env.AUTH_EMAIL_ORIGIN,process.env.NEXT_PUBLIC_SITE_URL].filter((v):v is string=>!!v).map(v=>new URL(v).origin)]);
 const value=await readAccountBody(request,[...allowed]);
 const forwarded=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
 const identity=process.env.ACCOUNT_TRUST_PROXY==='1'&&forwarded&&isIP(forwarded)?forwarded:'unconfigured-proxy';
 await takeRateLimit('account-http',identity,mailSettings().secret,120);
 return value;
}
export async function accountSession(){const session=await auth();if(!session?.user?.id||typeof session.user.authVersion!=='number')throw new AccountError('UNAUTHENTICATED');return session.user;}
export function accountResponse(body:unknown,status=200){return Response.json(body,{status,headers});}
export function accountFailure(error:unknown){
 const code=error instanceof AccountError?error.code:'UNAVAILABLE';
 const status=code==='RATE_LIMITED'?429:code==='UNAUTHENTICATED'?401:code==='DELIVERY_UNAVAILABLE'||code==='UNAVAILABLE'?503:400;
 return accountResponse({success:false,error:code},status);
}
export async function accountPost(request:Request,operation:(body:Record<string,unknown>)=>Promise<unknown>){try{return accountResponse(await operation(await accountJson(request)));}catch(error){return accountFailure(error);}}
