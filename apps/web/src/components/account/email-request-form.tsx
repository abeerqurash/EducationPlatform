"use client";
import { AccountForm } from './account-form';
export function EmailRequestForm({kind}:{kind:'reset'|'verification'}){return <AccountForm endpoint={kind==='reset'?'/api/account/forgot-password':'/api/account/resend-verification'} fields={[{name:'email',label:'Email',type:'email',autoComplete:'email'}]} label={kind==='reset'?'Request reset link':'Request verification link'} success="If an eligible account matches, an email will be queued. Check your inbox after delivery is processed."/>;}
