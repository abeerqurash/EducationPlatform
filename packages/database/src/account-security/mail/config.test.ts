import {describe,it,expect} from 'vitest';
import {mailSettings} from './config';
const defaults={AUTH_SECRET:'a'.repeat(64)};
describe('account mail configuration',()=>{
 it('is disabled by default',()=>expect(mailSettings(defaults).transport).toBe('disabled'));
 it('permits explicit local file capture',()=>expect(mailSettings({...defaults,EMAIL_TRANSPORT:'file',AUTH_EMAIL_ORIGIN:'http://localhost:3020'}).origin).toBe('http://localhost:3020'));
 it('rejects file capture for a public origin',()=>expect(()=>mailSettings({...defaults,EMAIL_TRANSPORT:'file',AUTH_EMAIL_ORIGIN:'https://example.com'})).toThrow());
 it('rejects live delivery without provider configuration',()=>expect(()=>mailSettings({...defaults,EMAIL_TRANSPORT:'resend'})).toThrow());
 it('requires HTTPS and a public origin for live delivery',()=>expect(()=>mailSettings({...defaults,EMAIL_TRANSPORT:'resend',AUTH_EMAIL_ORIGIN:'http://example.com',RESEND_API_KEY:'test',EMAIL_FROM:'test@example.com'})).toThrow());
 it('accepts an explicitly configured Resend adapter',()=>expect(mailSettings({...defaults,EMAIL_TRANSPORT:'resend',AUTH_EMAIL_ORIGIN:'https://example.com',RESEND_API_KEY:'test',EMAIL_FROM:'test@example.com'}).transport).toBe('resend'));
 it.each(['https://example.com/path','https://user:pass@example.com/','https://example.com/?secret=1'])('rejects unsafe mail origin %s',origin=>expect(()=>mailSettings({...defaults,AUTH_EMAIL_ORIGIN:origin})).toThrow());
 it('rejects weak secrets when delivery is enabled',()=>expect(()=>mailSettings({EMAIL_TRANSPORT:'file',AUTH_SECRET:'short'})).toThrow());
});
