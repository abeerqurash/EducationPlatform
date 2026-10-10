import { listSupportTickets } from '@education/database/learning-workspaces';
import { workspaceSession } from '@/lib/workspaces';
import { WorkspaceLayout } from '@/components/workspaces/workspace-layout';
import { SupportList } from '@/components/workspaces/support-list';
import { Panel } from '@/components/app-shell/dashboard-ui';
export const metadata={title:'Support staff inbox'};
export default async function Page(){const {user,actor}=await workspaceSession();const data=await listSupportTickets(actor,true);return <WorkspaceLayout user={user} title="Support staff inbox" description="Most recent 100 tickets. Access requires the Support workspace permission."><Panel title="Customer tickets"><SupportList tickets={data.tickets} staff/></Panel></WorkspaceLayout>;}
