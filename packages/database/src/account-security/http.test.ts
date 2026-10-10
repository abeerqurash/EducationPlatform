import {describe,it,expect} from 'vitest';
import {readAccountBody} from './http';
function request(body:string,origin='https://education.example',type='application/json'){return new Request('https://education.example/api/account/forgot-password',{method:'POST',headers:{Origin:origin,'Content-Type':type},body});}
describe('account HTTP boundary',()=>{
 it('accepts an explicit same-origin JSON object',async()=>expect(await readAccountBody(request('{"email":"a@example.test"}'),['https://education.example'])).toEqual({email:'a@example.test'}));
 it('rejects cross-origin requests',async()=>await expect(readAccountBody(request('{}','https://evil.example'),['https://education.example'])).rejects.toMatchObject({code:'INVALID_INPUT'}));
 it('rejects requests without origin evidence',async()=>{const req=request('{}');req.headers.delete('origin');await expect(readAccountBody(req,['https://education.example'])).rejects.toThrow();});
 it('rejects non-JSON media types',async()=>await expect(readAccountBody(request('{}','https://education.example','text/plain'),['https://education.example'])).rejects.toThrow());
 it.each(['[1]','null','"value"','not-json'])('rejects non-object or malformed JSON %s',async body=>await expect(readAccountBody(request(body),['https://education.example'])).rejects.toThrow());
 it('rejects a body above the stream byte limit without trusting length headers',async()=>await expect(readAccountBody(request(JSON.stringify({text:'a'.repeat(8192)})),['https://education.example'])).rejects.toThrow());
});
