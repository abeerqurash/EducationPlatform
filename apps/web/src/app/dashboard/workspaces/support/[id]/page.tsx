import Link from 'next/link';
import { supportTicketDetail } from '@education/database/learning-workspaces';
import { workspaceSession } from '@/lib/workspaces';
import { WorkspaceLayout } from '@/components/workspaces/workspace-layout';
import { SupportConversation } from '@/components/workspaces/support-conversation';
import { Panel } from '@/components/app-shell/dashboard-ui';
export const metadata={title:'Support conversation'};
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const {user,actor}=await workspaceSession();const data=await supportTicketDetail(actor,id);return <WorkspaceLayout user={user} title={data.ticket.subject} description={`${data.ticket.category} · ${data.ticket.status}`}><Panel title="Conversation" action={<Link className="text-sm underline" href={`/dashboard/workspaces/support/${id}/export-json`}>Download conversation</Link>}><SupportConversation id={id} status={data.ticket.status} messages={data.messages}/></Panel></WorkspaceLayout>;}
