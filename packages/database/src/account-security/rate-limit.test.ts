import {describe,it,expect} from 'vitest';
import {rateKey} from './rate-limit';
describe('privacy-preserving rate keys',()=>{
 it('normalizes email identity without storing it',()=>{const key=rateKey('reset',' Student@Example.test ','a'.repeat(64));expect(key).toBe(rateKey('reset','student@example.test','a'.repeat(64)));expect(key).toMatch(/^[a-f0-9]{64}$/);expect(key).not.toContain('student');});
 it('separates operations and key namespaces',()=>{expect(rateKey('reset','a','a'.repeat(64))).not.toBe(rateKey('verify','a','a'.repeat(64)));expect(rateKey('reset','a','a'.repeat(64))).not.toBe(rateKey('reset','a','b'.repeat(64)));});
 it('rejects weak keys',()=>expect(()=>rateKey('reset','a','short')).toThrow());
});
