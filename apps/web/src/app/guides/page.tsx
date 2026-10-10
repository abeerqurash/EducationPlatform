import { PublicShell, PublicCards } from '@/components/public/public-shell';
import { guides } from '@/lib/public/guides';
import { publicMetadata } from '@/lib/public/seo';
import Link from 'next/link';
type Props={searchParams:Promise<Record<string,string|string[]|undefined>>};
export async function generateMetadata({searchParams}:Props){const p=await searchParams;return {...publicMetadata('Learning guides','Original worked examples and practical study, math and application guides.','/guides'),...(Object.values(p).some(Boolean)?{robots:{index:false,follow:true}}:{})};}
export default async function Page({searchParams}:Props){
 const params=await searchParams;const query=typeof params.q==='string'?params.q.trim().slice(0,100):'';const category=typeof params.category==='string'?params.category:'';
 const matches=guides.filter(g=>(!category||g.category===category)&&`${g.title} ${g.description} ${g.category}`.toLowerCase().includes(query.toLowerCase()));
 return <PublicShell title="Learn the method. Make a plan." description="Original guides connect an explanation, a worked example and a useful next step."><form action="/guides" role="search" className="public-panel"><label className="public-field">Search guides<input type="search" name="q" defaultValue={query} maxLength={100}/></label><label className="public-field">Topic<select name="category" defaultValue={category}><option value="">All topics</option>{[...new Set(guides.map(g=>g.category))].map(c=><option key={c}>{c}</option>)}</select></label><button className="button button--primary">Find guides</button> <Link href="/guides">Reset</Link></form><p role="status">{matches.length} guides found</p><PublicCards items={matches.map(g=>({title:g.title,description:g.description,href:`/guides/${g.slug}`}))}/>{!matches.length&&<p>No matching guides. Try another topic or reset the search.</p>}</PublicShell>;
}
