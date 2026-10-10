import type { MetadataRoute } from 'next';
import { publicRoutes } from '../lib/public/routes';
import { siteOrigin, isPublicOrigin } from '../lib/public/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  const origin=siteOrigin();
  if(!isPublicOrigin(origin))return [];
  return publicRoutes().map(path=>({url:origin+path}));
}
