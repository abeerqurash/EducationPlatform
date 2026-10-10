import type { Metadata } from "next";

export function siteOrigin(value = process.env.NEXT_PUBLIC_SITE_URL): string {
  if (!value) return "http://localhost:3000";
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment.');
  }
  return url.origin;
}

export function isPublicOrigin(origin: string): boolean {
  const url = new URL(origin);
  return url.protocol === 'https:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) && !url.hostname.endsWith('.localhost');
}

export function publicMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: 'website' } };
}

export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
