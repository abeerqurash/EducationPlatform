import Link from 'next/link';
import { VerifyEmailForm } from '@/components/account/verify-email-form';
export const metadata={title:'Verify your email',referrer:'no-referrer' as const};
export default function Page(){return <main><h1>Verify your email</h1><p>Confirm access to your email address. Verification links expire after 24 hours.</p><VerifyEmailForm/><p><Link href="/login">Sign in</Link></p></main>;}
