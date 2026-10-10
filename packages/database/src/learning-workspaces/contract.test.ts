import { describe,it,expect } from 'vitest';
import { workspaceText,workspaceId,inviteEmail,inviteHash,newInvite,usableInvite,dueDate,supportCategory } from './contract';
describe('workspace boundaries',()=>{
 it.each([null,{},'', 'ab', 'x'.repeat(161)])('rejects invalid titles %j',v=>expect(()=>workspaceText(v,'Title')).toThrow());
 it('trims text',()=>expect(workspaceText('  Classroom  ','Title')).toBe('Classroom'));
 it.each(['fake','00000000-0000-0000-0000-000000000000',null])('rejects non UUID identities %j',v=>expect(()=>workspaceId(v)).toThrow());
 it('normalizes recipients',()=>expect(inviteEmail(' Person@Example.test ')).toBe('person@example.test'));
 it.each(['a@b','hello','a b@example.test',''])('rejects malformed email %s',v=>expect(()=>inviteEmail(v)).toThrow());
 it('generates distinct cryptographic invitations',()=>{const a=newInvite(),b=newInvite();expect(a.token).toHaveLength(64);expect(a.tokenHash).toBe(inviteHash(a.token));expect(a.token).not.toBe(b.token);expect(a.tokenHash).not.toBe(a.token);});
 it.each([null,'x'.repeat(64),'a'.repeat(63),'A'.repeat(64)])('rejects invalid invitation code %j',v=>expect(()=>inviteHash(v)).toThrow());
 const now=new Date('2026-10-10T00:00:00Z');const invite={email:'parent@example.test',expiresAt:new Date(now.getTime()+1000),usedAt:null,revokedAt:null};
 it('accepts only the bound recipient',()=>{expect(()=>usableInvite(invite,'PARENT@example.test',now)).not.toThrow();expect(()=>usableInvite(invite,'other@example.test',now)).toThrow();});
 it.each([{usedAt:now},{revokedAt:now},{expiresAt:now}])('rejects consumed revoked and expired codes %j',change=>expect(()=>usableInvite({...invite,...change},invite.email,now)).toThrow());
 it.each(['garbage','2026-10-09','2027-10-10',null])('bounds due dates %j',v=>expect(()=>dueDate(v,now)).toThrow());
 it('allows future dates within six months',()=>expect(dueDate('2026-10-11T00:00:00Z',now).toISOString()).toBe('2026-10-11T00:00:00.000Z'));
 it.each(['technical','account','content','accessibility'])('allows support category %s',v=>expect(supportCategory(v)).toBe(v));
 it.each(['billing','admin',{},null])('rejects unsupported categories %j',v=>expect(()=>supportCategory(v)).toThrow());
});
