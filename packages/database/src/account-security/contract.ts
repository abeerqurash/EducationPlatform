export type MailKind = 'verification' | 'reset';
export type SecurityEventKind = 'registered' | 'verification_requested' | 'email_verified' | 'reset_requested' | 'password_reset' | 'password_changed' | 'sessions_revoked';
export const requestAcknowledgement = 'If an eligible account matches, an email will be queued. Check your inbox after delivery is processed.';
export class AccountError extends Error {
  constructor(public code: 'INVALID_LINK'|'INVALID_INPUT'|'RATE_LIMITED'|'UNAUTHENTICATED'|'WRONG_PASSWORD'|'DELIVERY_UNAVAILABLE') { super(code); }
}
export function validAccountToken(value: unknown): value is string {return typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);}
export function usableToken(row: { usedAt: Date|null; expiresAt: Date },now=new Date()){return row.usedAt===null&&row.expiresAt.getTime()>now.getTime();}
export function sessionIsCurrent(user: {isActive:boolean;authVersion:number}|undefined,version:unknown){return !!user&&user.isActive&&typeof version==='number'&&Number.isInteger(version)&&user.authVersion===version;}
export function retryDelay(attempts:number){return Math.min(60*60,60*2**Math.max(0,attempts-1))*1000;}
