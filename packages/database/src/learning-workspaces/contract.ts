import { createHash, randomBytes } from 'node:crypto';
import { isQuestionId } from '../question-bank/contract';
export class WorkspaceError extends Error {}
export const workspacePermissions={educator:'classrooms.manage',support:'support.manage'} as const;
export function workspaceText(value:unknown,label:string,min=3,max=160){if(typeof value!=='string'||value.trim().length<min||value.trim().length>max)throw new WorkspaceError(`${label}: enter ${min}-${max} characters.`);return value.trim();}
export function workspaceId(value:unknown){if(!isQuestionId(value))throw new WorkspaceError('This item is unavailable.');return value;}
export function inviteEmail(value:unknown){const email=workspaceText(value,'Email',5,254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new WorkspaceError('Enter a valid email.');return email;}
export function inviteHash(token:unknown){if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))throw new WorkspaceError('Invitation unavailable.');return createHash('sha256').update(token).digest('hex');}
export function newInvite(){const token=randomBytes(32).toString('hex');return {token,tokenHash:inviteHash(token)};}
export function usableInvite(row:{email:string;expiresAt:Date;usedAt:Date|null;revokedAt:Date|null},email:string,now=new Date()){if(row.email!==email.toLowerCase()||row.expiresAt<=now||row.usedAt||row.revokedAt)throw new WorkspaceError('Invitation unavailable.');}
export function dueDate(value:unknown,now=new Date()){if(typeof value!=='string')throw new WorkspaceError('Choose a due date.');const date=new Date(value);if(!Number.isFinite(date.getTime())||date<=now||date.getTime()>now.getTime()+180*86400000)throw new WorkspaceError('Choose a future due date within 180 days.');return date;}
export function supportCategory(value:unknown){if(!['technical','account','content','accessibility'].includes(String(value)))throw new WorkspaceError('Choose a support category.');return String(value);}
