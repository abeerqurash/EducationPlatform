import {describe,it,expect} from 'vitest';
import {accountLink,renderAccountMail,parseAccountMail} from './templates';
describe('account email templates',()=>{
 it('keeps secrets in fragments instead of request query strings',()=>{const url=new URL(accountLink('https://example.com','reset','a'.repeat(64)));expect(url.search).toBe('');expect(url.hash).toBe('#token='+'a'.repeat(64));expect(url.pathname).toBe('/reset-password');});
 it('states the reset lifetime and does not send a password',()=>{const mail=renderAccountMail({to:'a@example.test',kind:'reset',url:accountLink('https://example.com','reset','a'.repeat(64))});expect(mail.text).toContain('30 minutes');expect(mail.subject).toContain('Reset');});
 it('states the verification lifetime',()=>expect(renderAccountMail({to:'a@example.test',kind:'verification',url:accountLink('https://example.com','verification','a'.repeat(64))}).text).toContain('24 hours'));
 it('rejects malformed decrypted payloads',()=>{expect(()=>parseAccountMail(null)).toThrow();expect(()=>parseAccountMail({to:'a@example.test',kind:'reset',url:'javascript:alert(1)'})).toThrow();});
});
