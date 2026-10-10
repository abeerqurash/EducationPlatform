import Link from 'next/link';
import { classroomDetail } from '@education/database/learning-workspaces';
import { workspaceSession } from '@/lib/workspaces';
import { WorkspaceLayout } from '@/components/workspaces/workspace-layout';
import { Panel } from '@/components/app-shell/dashboard-ui';
export const metadata={title:'Classroom assignments'};
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const {user,actor}=await workspaceSession();const data=await classroomDetail(actor,id);return <WorkspaceLayout user={user} title={data.room.title} description="Your classroom assignments. Only assigned results are shared with your educator."><Panel title="Assignments">{data.assignments.length?data.assignments.map(a=>{const work=data.work.find(w=>w.assignmentId===a.id);return <div key={a.id} className="mb-4 rounded-xl border p-4"><Link className="font-bold underline" href={`/dashboard/workspaces/assignments/${a.id}`}>{a.title}</Link><p className="mt-2 text-sm text-slate-500">{a.exam} · {a.revisionIds.length} questions · Due {a.dueAt.toISOString()} · {work?.submittedAt?`Submitted ${work.percentage}%`:a.closedAt?'Closed':'Open'}</p></div>;}):<p className="text-sm text-slate-500">Your educator has not created an assignment yet.</p>}</Panel></WorkspaceLayout>;}
