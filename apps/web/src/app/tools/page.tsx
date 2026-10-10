import { PublicShell } from '@/components/public/public-shell';
import { ToolsFilter } from '@/components/tools/tools-filter';
import { ToolCard } from '@/components/tools/tool-card';
import { getPublicTools, getPublicToolCategories } from '@/lib/tools/catalog';
import { publicMetadata } from '@/lib/public/seo';
import Link from 'next/link';
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  return {...publicMetadata('Student tools', 'Find implemented calculators and planners for grades, GPA, math and study.', '/tools'), ...(Object.values(params).some(Boolean) ? {robots:{index:false,follow:true}} : {})};
}
export default async function Page({searchParams}: Props) {
  const params=await searchParams;
  const text=(key:string)=>typeof params[key]==='string' ? params[key].trim().slice(0,100) : '';
  const query=text('q'), category=text('category'), access=text('access');
  const [tools,categories]=await Promise.all([getPublicTools({query,category,access:access==='free'||access==='premium'?access:undefined}),getPublicToolCategories()]);
  return <PublicShell title="Find your next useful tool" description="Explore working calculators and planners. Read each tool’s method and limitations before using its result."><ToolsFilter key={`${category}:${access}:${query}`} query={query} category={category} access={access} categories={categories}/><p role="status">{tools.length} {tools.length===1?'tool':'tools'} found</p>{tools.length ? <div className="directory-tool-grid">{tools.map(tool=><ToolCard key={tool.id} tool={tool}/>)}</div> : <section className="public-panel"><h2>No matching tools</h2><p>Try another search term or reset the filters.</p><Link href="/tools" className="button button--secondary">Reset filters</Link></section>}</PublicShell>;
}
