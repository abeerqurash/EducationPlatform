import { dashboardAction } from '@/components/shared/dashboard-action-styles';
import Link from 'next/link';
import { listSupportTickets } from '@education/database/learning-workspaces';
import { workspaceSession } from '@/lib/workspaces';
import { WorkspaceLayout } from '@/components/workspaces/workspace-layout';
import { WorkspaceForm } from '@/components/workspaces/workspace-form';
import { SupportList } from '@/components/workspaces/support-list';
import { SupportFilters } from '@/components/workspaces/support-filters';
import { SupportPagination } from '@/components/workspaces/support-pagination';
import { Panel } from '@/components/app-shell/dashboard-ui';
export const metadata={title:'Private support tickets'};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const {user,actor}=await workspaceSession();const data=await listSupportTickets(actor,false,await searchParams);return <WorkspaceLayout user={user} title="Support tickets" description="Ask for help in a private conversation. Do not include passwords, payment details, or sensitive student records.">{data.canSupport?<Link className={dashboardAction} href="/dashboard/workspaces/staff-support">Open staff inbox</Link>:null}<Panel title="Open a ticket" description="Replies appear here. Email notifications are disabled."><WorkspaceForm action="ticket.create" fields={[{name:'subject',label:'Subject'},{name:'category',label:'Category',type:'select',options:['technical','account','content','accessibility']},{name:'message',label:'How can we help?',type:'textarea'}]} label="Open ticket"/></Panel><Panel title="Your tickets"><SupportFilters query={data.query}/><SupportList tickets={data.tickets}/><SupportPagination {...data}/></Panel></WorkspaceLayout>;}
