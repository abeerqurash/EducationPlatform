import Link from 'next/link';
import { listSupportTickets } from '@education/database/learning-workspaces';
import { workspaceSession } from '@/lib/workspaces';
import { WorkspaceLayout } from '@/components/workspaces/workspace-layout';
import { WorkspaceForm } from '@/components/workspaces/workspace-form';
import { SupportList } from '@/components/workspaces/support-list';
import { Panel } from '@/components/app-shell/dashboard-ui';
export const metadata={title:'Private support tickets'};
export default async function Page(){const {user,actor}=await workspaceSession();const data=await listSupportTickets(actor);return <WorkspaceLayout user={user} title="Support tickets" description="Ask for help in a private conversation. Do not include passwords, payment details, or sensitive student records.">{data.canSupport?<Link className="block text-sm font-bold underline" href="/dashboard/workspaces/staff-support">Open staff inbox</Link>:null}<Panel title="Open a ticket" description="Replies appear here. Email notifications are disabled."><WorkspaceForm action="ticket.create" fields={[{name:'subject',label:'Subject'},{name:'category',label:'Category',type:'select',options:['technical','account','content','accessibility']},{name:'message',label:'How can we help?',type:'textarea'}]} label="Open ticket"/></Panel><Panel title="Your recent tickets"><SupportList tickets={data.tickets}/></Panel></WorkspaceLayout>;}
