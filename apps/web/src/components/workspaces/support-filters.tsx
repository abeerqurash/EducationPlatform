import { dashboardActionPrimary,dashboardField } from '@/components/shared/dashboard-action-styles';
import type { SupportQuery } from '@education/database/learning-workspaces/support-query';
import { ThemedExportSelect } from '@/components/shared/themed-export-select';
export function SupportFilters({query,staff=false}:{query:SupportQuery;staff?:boolean}){
 const fields=[['status','Status',['all','open','replied','closed']],['category','Category',['all','technical','account','content','accessibility']],['priority','Priority',['all','low','normal','high']],['sort','Sort',['newest','priority']],...(staff?[['assignment','Assignment',['all','mine','unassigned']]]:[])] as const;
 return <form className="mb-5 flex flex-wrap items-end gap-3" action={`/dashboard/workspaces/${staff?'staff-support':'support'}`}>
  <label className="block text-xs font-bold">Search subject<input name="q" defaultValue={query.q} maxLength={100} className={dashboardField}/></label>
  {fields.map(([name,label,options])=><ThemedExportSelect key={`${name}:${query[name as keyof SupportQuery]}`} name={name as string} label={label as string} defaultValue={String(query[name as keyof SupportQuery])} options={(options as readonly string[]).map(option=>({value:option,label:option==='all'?'All':option.charAt(0).toUpperCase()+option.slice(1)}))}/>)}
  <button className={dashboardActionPrimary}>Apply filters</button>
 </form>;
}
