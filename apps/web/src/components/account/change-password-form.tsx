"use client";
import { AccountForm } from './account-form';
export function ChangePasswordForm(){return <AccountForm endpoint="/api/account/change-password" fields={[{name:'currentPassword',label:'Current password',type:'password',autoComplete:'current-password'},{name:'password',label:'New password',type:'password',autoComplete:'new-password',minLength:12},{name:'confirmPassword',label:'Confirm new password',type:'password',autoComplete:'new-password',minLength:12}]} passwordHelp label="Change password" success="Password changed. Sign in again." redirect="/login?passwordChanged=1"/>;}
