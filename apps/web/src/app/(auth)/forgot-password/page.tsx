import Link from 'next/link';
import { EmailRequestForm } from '@/components/account/email-request-form';
export const metadata={title:'Recover your account',referrer:'no-referrer' as const};
export default function Page(){return <main><h1>Recover your account</h1><p>Enter the email used for your account. Reset links expire after 30 minutes.</p><EmailRequestForm kind="reset"/><p><Link href="/login">Sign in</Link></p></main>;}
