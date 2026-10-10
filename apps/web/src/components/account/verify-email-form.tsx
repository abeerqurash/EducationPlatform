"use client";
import Link from 'next/link';
import { AccountForm } from './account-form';
import { useAccountLink } from './use-account-link';
import { EmailRequestForm } from './email-request-form';
export function VerifyEmailForm(){const {token,ready}=useAccountLink();return <>{!ready?<p>Reading your verification link…</p>:token?<AccountForm endpoint="/api/account/verify-email" token={token} fields={[]} label="Confirm email address" success="Email address verified. You can return to your account."/>:<><p>Enter your email to request a verification link.</p><EmailRequestForm kind="verification"/></>}<p><Link href="/login">Return to sign in</Link></p></>;}
