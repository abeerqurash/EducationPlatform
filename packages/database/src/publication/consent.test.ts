import { it,expect } from 'vitest';
import { parseConsent,consentChoice,optionalConsent } from '../../../../apps/web/src/lib/privacy/consent';
const now=new Date('2026-10-10T00:00:00Z');
it.each([null,'','garbage','{}','null','[]',JSON.stringify({version:2,necessary:true}),JSON.stringify({version:1,necessary:false,analytics:true,marketing:true,updatedAt:now.toISOString()})])('fails closed for invalid consent %j',raw=>expect(parseConsent(raw,now)).toBeNull());
it('keeps optional tracking off without consent',()=>{expect(optionalConsent(null,'analytics')).toBe(false);expect(optionalConsent(null,'marketing')).toBe(false);});
it.each([[false,false],[true,false],[false,true],[true,true]])('round trips explicit choices %j %j',(analytics,marketing)=>{const choice=consentChoice(analytics,marketing,now);expect(parseConsent(JSON.stringify(choice),now)).toEqual(choice);expect(optionalConsent(choice,'analytics')).toBe(analytics);expect(optionalConsent(choice,'marketing')).toBe(marketing);});
it('expires after 180 days',()=>expect(parseConsent(JSON.stringify(consentChoice(true,true,new Date(now.getTime()-181*86400000))),now)).toBeNull());
it('rejects future dates',()=>expect(parseConsent(JSON.stringify(consentChoice(true,true,new Date(now.getTime()+1000))),now)).toBeNull());
