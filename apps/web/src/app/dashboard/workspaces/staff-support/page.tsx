import { listSupportTickets } from '@education/database/learning-workspaces';
import { workspaceSession } from '@/lib/workspaces';
import { WorkspaceLayout } from '@/components/workspaces/workspace-layout';
import { SupportList } from '@/components/workspaces/support-list';
import { SupportFilters } from '@/components/workspaces/support-filters';
import { SupportPagination } from '@/components/workspaces/support-pagination';
import { Panel } from '@/components/app-shell/dashboard-ui';
export const metadata={title:'Support staff inbox'};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const {user,actor}=await workspaceSession();const data=await listSupportTickets(actor,true,await searchParams);return <WorkspaceLayout user={user} title="Support staff inbox" description="Search, filter and triage private tickets. Access requires the Support workspace permission."><Panel title="Customer tickets"><SupportFilters query={data.query} staff/><SupportList tickets={data.tickets} staff/><SupportPagination {...data} staff/></Panel></WorkspaceLayout>;}
