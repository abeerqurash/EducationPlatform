import Link from 'next/link';
import { ResetPasswordForm } from '@/components/account/reset-password-form';
export const metadata={title:'Set a new password',referrer:'no-referrer' as const};
export default function Page(){return <main><h1>Set a new password</h1><p>Open a reset link from your email and choose a new password.</p><ResetPasswordForm/><p><Link href="/login">Sign in</Link></p></main>;}
