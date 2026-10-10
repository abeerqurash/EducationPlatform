import { describe,it,expect } from 'vitest';
import { sealPayload,openPayload } from './crypto';
const secret='a'.repeat(64);
describe('encrypted account email payloads',()=>{
 it('round-trips without keeping the plaintext token in storage',()=>{const value={token:'sensitive-token',to:'student@example.test'};const sealed=sealPayload(value,secret);expect(sealed).not.toContain('sensitive-token');expect(openPayload(sealed,secret)).toEqual(value);});
 it('uses a fresh nonce for each payload',()=>expect(sealPayload({a:1},secret)).not.toBe(sealPayload({a:1},secret)));
 it('rejects a different key',()=>expect(()=>openPayload(sealPayload({a:1},secret),'b'.repeat(64))).toThrow());
 it('rejects authentication-tag tampering',()=>{const parts=sealPayload({a:1},secret).split('.');parts[2]='AAAAAAAAAAAAAAAAAAAAAA';expect(()=>openPayload(parts.join('.'),secret)).toThrow();});
 it('rejects weak encryption secrets',()=>expect(()=>sealPayload({},'short')).toThrow());
 it('rejects malformed or unsupported ciphertext',()=>{expect(()=>openPayload('v2.a.b.c',secret)).toThrow();expect(()=>openPayload('v1.a.b.c.extra',secret)).toThrow();});
});
