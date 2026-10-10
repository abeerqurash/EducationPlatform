"use client";
import Link from 'next/link';
import { AccountForm } from './account-form';
import { useAccountLink } from './use-account-link';
export function ResetPasswordForm(){const {token,ready}=useAccountLink();if(!ready)return <p>Reading your reset link…</p>;if(!token)return <p>No valid reset link was provided. <Link href="/forgot-password">Request a new link</Link>.</p>;return <><AccountForm endpoint="/api/account/reset-password" token={token} fields={[{name:'password',label:'New password',type:'password',autoComplete:'new-password',minLength:12},{name:'confirmPassword',label:'Confirm new password',type:'password',autoComplete:'new-password',minLength:12}]} passwordHelp label="Reset password" success="Password reset. Your previous sessions have ended. Sign in with your new password."/><p><Link href="/login">Return to sign in</Link></p></>;}
