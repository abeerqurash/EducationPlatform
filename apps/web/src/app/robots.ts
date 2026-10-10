import type { MetadataRoute } from 'next';
import { siteOrigin, isPublicOrigin } from '../lib/public/seo';
export default function robots(): MetadataRoute.Robots {
 const origin=siteOrigin();
 if(!isPublicOrigin(origin))return {rules:{userAgent:'*',disallow:'/'}};
 return {rules:{userAgent:'*',allow:'/',disallow:['/api/']},sitemap:`${origin}/sitemap.xml`};
}
