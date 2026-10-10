"use client";
import { AccountForm } from './account-form';
export function RevokeSessionsForm(){return <><p>This signs out every session, including this browser, on its next authenticated request. Confirm your password to continue.</p><AccountForm endpoint="/api/account/revoke-sessions" fields={[{name:'currentPassword',label:'Confirm current password',type:'password',autoComplete:'current-password'}]} label="Sign out all sessions" success="Sessions revoked." redirect="/login?sessionsRevoked=1"/></>;}
