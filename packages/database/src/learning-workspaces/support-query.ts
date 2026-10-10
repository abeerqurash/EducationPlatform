import { WorkspaceError } from './contract';
export const SUPPORT_PAGE_SIZE=25;
export type SupportQuery={q:string;status:string;category:string;priority:string;assignment:string;sort:string;page:number};
function choice(value:unknown,options:readonly string[],fallback='all'){return typeof value==='string'&&options.includes(value)?value:fallback;}
export function normalizeSupportQuery(input:Record<string,unknown>={},staff=false):SupportQuery{
 const rawPage=typeof input.page==='number'?input.page:typeof input.page==='string'&&/^\d+$/.test(input.page)?Number(input.page):1;
 return {q:typeof input.q==='string'?input.q.trim().slice(0,100):'',status:choice(input.status,['open','replied','closed']),category:choice(input.category,['technical','account','content','accessibility']),priority:choice(input.priority,['low','normal','high']),assignment:staff?choice(input.assignment,['mine','unassigned']):'all',sort:choice(input.sort,['newest','priority'],'newest'),page:Number.isSafeInteger(rawPage)?Math.max(1,Math.min(10000,rawPage)):1};
}
export function supportSearchPattern(query:string){return '%'+query.replace(/[\\%_]/g,'\\$&')+'%';}
export function supportPriority(value:unknown):'low'|'normal'|'high'{if(value!=='low'&&value!=='normal'&&value!=='high')throw new WorkspaceError('Choose low, normal, or high priority.');return value;}
export function supportPageHref(staff:boolean,query:SupportQuery,page:number){const values=new URLSearchParams();for(const key of ['q','status','category','priority','assignment','sort'] as const){const value=query[key];if(value&&value!=='all'&&!(key==='sort'&&value==='newest'))values.set(key,value);}values.set('page',String(page));return `/dashboard/workspaces/${staff?'staff-support':'support'}?${values}`;}
