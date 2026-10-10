export const CONSENT_KEY='education-platform-consent-v1';
export type Consent={version:1;necessary:true;analytics:boolean;marketing:boolean;updatedAt:string};
export function consentChoice(analytics:boolean,marketing:boolean,now=new Date()):Consent{return {version:1,necessary:true,analytics,marketing,updatedAt:now.toISOString()};}
export function parseConsent(raw:string|null,now=new Date()):Consent|null{if(!raw)return null;try{const value=JSON.parse(raw);if(value?.version!==1||value.necessary!==true||typeof value.analytics!=='boolean'||typeof value.marketing!=='boolean'||typeof value.updatedAt!=='string')return null;const date=new Date(value.updatedAt);if(!Number.isFinite(date.getTime())||date>now||now.getTime()-date.getTime()>180*86400000)return null;return value;}catch{return null;}}
export function optionalConsent(consent:Consent|null,category:'analytics'|'marketing'){return consent?.[category]===true;}
