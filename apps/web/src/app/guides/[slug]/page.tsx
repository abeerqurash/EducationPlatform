import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicShell, PublicCards } from '@/components/public/public-shell';
import { guides, findGuide } from '@/lib/public/guides';
import { publicMetadata, jsonLd, siteOrigin } from '@/lib/public/seo';
type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return guides.map(g=>({slug:g.slug}));}
export async function generateMetadata({params}:Props){const guide=findGuide((await params).slug);return guide?publicMetadata(guide.title,guide.description,`/guides/${guide.slug}`):{title:'Guide not found',robots:{index:false,follow:false}};}
export default async function Page({params}:Props){const guide=findGuide((await params).slug);if(!guide)notFound();
 const related=guides.filter(g=>g.category===guide.category&&g.slug!==guide.slug).slice(0,3);
 return <PublicShell title={guide.title} description={guide.description} eyebrow={guide.category}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({'@context':'https://schema.org','@type':'Article',headline:guide.title,description:guide.description,datePublished:'2026-10-10',dateModified:'2026-10-10',author:{'@type':'Organization',name:'Education Platform'},mainEntityOfPage:`${siteOrigin()}/guides/${guide.slug}`})}}/><article className="public-panel guide-article"><p>Education Platform · Updated 10 October 2026</p>{guide.sections.map(section=><section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}<div className="public-actions"><Link className="button button--primary" href={guide.toolHref}>Try the related tool</Link><Link className="button button--secondary" href="/guides">All guides</Link></div></article>{related.length>0&&<section><h2>Continue learning</h2><PublicCards items={related.map(g=>({title:g.title,description:g.description,href:`/guides/${g.slug}`}))}/></section>}</PublicShell>;
}
