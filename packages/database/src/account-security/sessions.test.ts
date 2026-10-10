import { describe,it,expect } from 'vitest';
import {sessionIsCurrent} from './contract';
describe('revocable account sessions',()=>{
 it('accepts an active matching version',()=>expect(sessionIsCurrent({isActive:true,authVersion:0},0)).toBe(true));
 it('rejects a version from before a password change',()=>expect(sessionIsCurrent({isActive:true,authVersion:1},0)).toBe(false));
 it('rejects inactive accounts',()=>expect(sessionIsCurrent({isActive:false,authVersion:1},1)).toBe(false));
 it('rejects missing accounts',()=>expect(sessionIsCurrent(undefined,0)).toBe(false));
 it.each([undefined,'0',NaN,0.5,null])('rejects malformed or legacy version %s',version=>expect(sessionIsCurrent({isActive:true,authVersion:0},version)).toBe(false));
});
