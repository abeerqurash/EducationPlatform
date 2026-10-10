import {describe,it,expect,vi} from 'vitest';
import {sendResend} from './resend';
import {DeliveryError} from './errors';
const settings={transport:'resend' as const,origin:'https://example.com',secret:'a'.repeat(64),apiKey:'test-key',from:'sender@example.test'};
const mail={to:'student@example.test',kind:'reset' as const,url:'https://example.com/reset-password#token='+'a'.repeat(64)};
describe('Resend delivery adapter without live network',()=>{
 it('uses a stable idempotency key and plain text payload',async()=>{const fetcher=vi.fn(async(_url:RequestInfo|URL,_init?:RequestInit)=>Response.json({id:'provider-id'}));expect(await sendResend('message-id',mail,settings,fetcher)).toBe('provider-id');const init=fetcher.mock.calls[0]?.[1];expect((init?.headers as Record<string,string>)['Idempotency-Key']).toBe('account-message-id');const body=JSON.parse(String(init?.body));expect(body.to).toEqual(['student@example.test']);expect(body.text).toContain(mail.url);});
 it.each([429,500,503])('retries transient HTTP %s',async status=>{await expect(sendResend('id',mail,settings,async()=>new Response('',{status}))).rejects.toMatchObject({retryable:true,code:`HTTP_${status}`});});
 it('does not retry a permanent recipient/configuration error',async()=>await expect(sendResend('id',mail,settings,async()=>new Response('',{status:400}))).rejects.toMatchObject({retryable:false}));
 it('hides provider response bodies from stored errors',async()=>{try{await sendResend('id',mail,settings,async()=>new Response('secret-token',{status:401}));}catch(error){expect(error).toBeInstanceOf(DeliveryError);expect(String(error)).not.toContain('secret-token');}});
 it('classifies network failures as retryable',async()=>await expect(sendResend('id',mail,settings,async()=>{throw new Error('secret details');})).rejects.toMatchObject({code:'NETWORK',retryable:true}));
});
