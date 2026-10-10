import { describe,it,expect } from 'vitest';
import { validAccountToken,usableToken,retryDelay } from './contract';
describe('account link contract',()=>{
 it('accepts only 256-bit lowercase hexadecimal tokens',()=>expect(validAccountToken('a'.repeat(64))).toBe(true));
 it.each(['a'.repeat(63),'g'.repeat(64),'A'.repeat(64),null,123,'a'.repeat(65)])('rejects malformed tokens %s',token=>expect(validAccountToken(token)).toBe(false));
 it('rejects expired links at the exact boundary',()=>{const now=new Date();expect(usableToken({usedAt:null,expiresAt:now},now)).toBe(false);});
 it('rejects replayed links',()=>expect(usableToken({usedAt:new Date(),expiresAt:new Date(Date.now()+60000)})).toBe(false));
 it('accepts unused future links',()=>expect(usableToken({usedAt:null,expiresAt:new Date(Date.now()+60000)})).toBe(true));
 it('backs off retries deterministically with a cap',()=>{expect(retryDelay(1)).toBe(60000);expect(retryDelay(3)).toBe(240000);expect(retryDelay(20)).toBe(3600000);});
});
