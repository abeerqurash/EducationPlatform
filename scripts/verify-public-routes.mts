import { publicRoutes } from '../apps/web/src/lib/public/routes.ts';
const base = process.env.PUBLIC_TEST_BASE_URL ?? 'http://localhost:3000';
const failures: string[] = [];
for (const path of publicRoutes()) {
  const response = await fetch(new URL(path, base), { redirect: 'follow' });
  if (response.status !== 200) failures.push(`${path}: HTTP ${response.status}`);
  const html = await response.text();
  if (!/<h1[\s>]/.test(html)) failures.push(`${path}: missing main heading`);
  if (!html.includes('rel="canonical"')) failures.push(`${path}: missing canonical`);
}
for (const path of ['/guides/unknown-guide', '/tools/unknown-category', '/tools/math/unknown-tool']) {
  const response = await fetch(new URL(path,base));
  if(response.status!==404)failures.push(`${path}: expected 404, got ${response.status}`);
}
const sitemap = await fetch(new URL('/sitemap.xml',base));
if(sitemap.status!==200)failures.push('sitemap unavailable');
const xml=await sitemap.text();
if(/<loc>[^<]*(?:\/dashboard|\/admin|\/login|\/api\/)/.test(xml))failures.push('private route in sitemap');
const robots=await fetch(new URL('/robots.txt',base));
if(robots.status!==200)failures.push('robots unavailable');
if(failures.length)throw new Error(failures.join('\n'));
console.log(JSON.stringify({ publicRoutes:publicRoutes().length,statuses:200,headings:true,canonicals:true,unknownRoutes404:true,privateSitemapExcluded:true }));
