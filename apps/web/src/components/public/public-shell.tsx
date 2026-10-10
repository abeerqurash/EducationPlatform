import Link from "next/link";
import type { ReactNode } from "react";

export function PublicShell({ title, description, eyebrow = 'Student resources', children }: { title: string; description: string; eyebrow?: string; children: ReactNode }) {
  return <main className="public-page"><div className="site-container"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav><header className="public-hero"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></header><div className="public-body">{children}</div></div></main>;
}

export function PublicCards({ items }: { items: readonly { title: string; description: string; href: string }[] }) {
  return <div className="public-grid">{items.map(item => <Link className="public-card" href={item.href} key={item.href}><h2>{item.title}</h2><p>{item.description}</p><span>Explore →</span></Link>)}</div>;
}
