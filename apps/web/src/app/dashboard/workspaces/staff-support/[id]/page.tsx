import { supportTicketDetail } from '@education/database/learning-workspaces';
import { workspaceSession } from '@/lib/workspaces';
import { WorkspaceLayout } from '@/components/workspaces/workspace-layout';
import { SupportConversation } from '@/components/workspaces/support-conversation';
import { SupportTriage } from '@/components/workspaces/support-triage';
import { Panel } from '@/components/app-shell/dashboard-ui';
export const metadata={title:'Staff support conversation'};
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const {user,actor}=await workspaceSession();const data=await supportTicketDetail(actor,id,true);return <WorkspaceLayout user={user} title={data.ticket.subject} description={`${data.ticket.category} · ${data.ticket.status}`}><Panel title="Customer conversation"><SupportTriage id={id} priority={data.ticket.priority} assigneeId={data.ticket.assigneeId} actorId={actor.id}/><SupportConversation id={id} status={data.ticket.status} messages={data.messages} staff/></Panel></WorkspaceLayout>;}
