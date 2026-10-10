import { describe, expect, it, vi, afterEach } from 'vitest';
import sitemap from '../../../../apps/web/src/app/sitemap';
import robots from '../../../../apps/web/src/app/robots';
import { allocateStudyMinutes, validChecklist } from '../../../../apps/web/src/lib/public/planning';
import { siteOrigin, isPublicOrigin, jsonLd } from '../../../../apps/web/src/lib/public/seo';
import { publicRoutes } from '../../../../apps/web/src/lib/public/routes';

describe('public planning behavior', () => {
  it('allocates by relative priority', () => expect(allocateStudyMinutes(300,[{name:'Math',weight:3},{name:'Reading',weight:2}])).toEqual([{name:'Math',minutes:180},{name:'Reading',minutes:120}]));
  it('preserves the budget and resolves equal remainders in input order', () => expect(allocateStudyMinutes(16,[{name:'A',weight:1},{name:'B',weight:1},{name:'C',weight:1}]).map(r=>r.minutes)).toEqual([6,5,5]));
  it('preserves all budgets for unequal priorities', () => {for(let minutes=15;minutes<100;minutes++)expect(allocateStudyMinutes(minutes,[{name:'A',weight:5},{name:'B',weight:2},{name:'C',weight:1}]).reduce((n,r)=>n+r.minutes,0)).toBe(minutes);});
  it.each([0,14,10081,NaN,Infinity,30.5])('rejects invalid budget %s', minutes=>expect(()=>allocateStudyMinutes(minutes,[{name:'A',weight:1}])).toThrow());
  it('rejects blank subjects and invalid weights',()=>{expect(()=>allocateStudyMinutes(60,[{name:' ',weight:1}])).toThrow();expect(()=>allocateStudyMinutes(60,[{name:'A',weight:0}])).toThrow();expect(()=>allocateStudyMinutes(60,[{name:'A',weight:1.5}])).toThrow();expect(()=>allocateStudyMinutes(60,[])).toThrow();});
  it('rejects oversized subject sets',()=>expect(()=>allocateStudyMinutes(60,Array.from({length:13},()=>({name:'A',weight:1})))).toThrow());
  it('deduplicates known checklist IDs',()=>expect(validChecklist(['tests','tests','review'])).toEqual(['tests','review']));
  it.each([null,{},['unknown'],[1]])('rejects corrupted stored data %s',value=>expect(()=>validChecklist(value)).toThrow());
});
describe('public discovery and metadata',()=>{
  afterEach(()=>vi.unstubAllEnvs());
  it('emits the implemented public URLs for a configured HTTPS site',()=>{vi.stubEnv('NEXT_PUBLIC_SITE_URL','https://education.example');expect(sitemap().map(row=>row.url)).toEqual(publicRoutes().map(path=>'https://education.example'+path));expect(robots().sitemap).toBe('https://education.example/sitemap.xml');});
  it('blocks local crawling and returns an empty local sitemap',()=>{vi.stubEnv('NEXT_PUBLIC_SITE_URL','http://localhost:3000');expect(sitemap()).toEqual([]);expect(robots()).toEqual({rules:{userAgent:'*',disallow:'/'}});});
  it('normalizes an origin',()=>expect(siteOrigin('https://example.com/')).toBe('https://example.com'));
  it.each(['javascript:alert(1)','https://user:pass@example.com','https://example.com/path','https://example.com/?key=secret','https://example.com/#fragment'])('rejects unsafe origin %s',value=>expect(()=>siteOrigin(value)).toThrow());
  it.each(['http://example.com','http://localhost:3000','https://localhost','https://127.0.0.1','https://[::1]','https://test.localhost'])('does not advertise a local or HTTP sitemap %s',origin=>expect(isPublicOrigin(origin)).toBe(false));
  it('recognizes a configured HTTPS deployment',()=>expect(isPublicOrigin('https://example.com')).toBe(true));
  it('escapes executable script boundaries while preserving data',()=>{const data={headline:'</script><script>alert(1)</script>'};expect(jsonLd(data)).not.toContain('<');expect(JSON.parse(jsonLd(data))).toEqual(data);});
  it('has unique implemented discovery routes without private or alias URLs',()=>{const routes=publicRoutes();expect(new Set(routes).size).toBe(routes.length);expect(routes).toContain('/tools/math/weighted-average-calculator');expect(routes).toContain('/tools/admissions/application-checklist');expect(routes.some(r=>r.startsWith('/admin')||r.startsWith('/dashboard')||r==='/blog'||r.endsWith('/sat-score-calculator'))).toBe(false);});
});
