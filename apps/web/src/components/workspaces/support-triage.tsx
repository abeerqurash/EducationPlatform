'use client';
import { dashboardActionPrimary } from '@/components/shared/dashboard-action-styles';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemedExportSelect } from '@/components/shared/themed-export-select';
export function SupportTriage({id,priority,assigneeId,actorId}:{id:string;priority:string;assigneeId:string|null;actorId:string}){
 const router=useRouter();const [pending,setPending]=useState(false);const [message,setMessage]=useState('');
 const mine=assigneeId===actorId;
 return <form className="mb-6 space-y-4 rounded-2xl border border-[#dfe0d5] bg-[#f7f8f2] p-4" onSubmit={async event=>{event.preventDefault();const data=new FormData(event.currentTarget);setPending(true);try{const response=await fetch('/api/workspaces',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'ticket.triage',id,priority:data.get('priority'),assignment:data.get('assignment')})});const result=await response.json();if(!response.ok)throw new Error(result.error||'Unable to update.');setMessage('Triage saved.');router.refresh();}catch(error){setMessage(error instanceof Error?error.message:'Unable to update.');}finally{setPending(false);}}}>
  <p className="text-sm font-bold">Assigned operator: {mine?'You':assigneeId?'Another operator':'Unassigned'}</p>
  <ThemedExportSelect key={priority} name="priority" label="Ticket priority" defaultValue={priority} options={['low','normal','high'].map(value=>({value,label:value.charAt(0).toUpperCase()+value.slice(1)}))}/>
  <ThemedExportSelect key={assigneeId??'unassigned'} name="assignment" label="Assignment action" defaultValue="keep" options={[{value:'keep',label:'Keep current assignment'},{value:'claim',label:'Assign to me'},...(mine?[{value:'release',label:'Release my assignment'}]:[])]}/>
  {assigneeId&&!mine?<p className="text-xs text-[#6c7162]">Reassignment is allowed only if the previous operator is inactive or no longer has support access.</p>:null}
  <button disabled={pending} className={dashboardActionPrimary}>{pending?'Saving…':'Save triage'}</button><p role="status" className="text-sm">{message}</p>
 </form>;
}
