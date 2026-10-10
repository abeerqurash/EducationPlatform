import { workspaceSession } from '@/lib/workspaces';
import { WorkspaceLayout } from '@/components/workspaces/workspace-layout';
import { WorkspaceForm } from '@/components/workspaces/workspace-form';
import { Panel } from '@/components/app-shell/dashboard-ui';
export const metadata={title:'Accept private invitation'};
export default async function Page(){const {user}=await workspaceSession();return <WorkspaceLayout user={user} title="Accept invitation" description="Your verified email must match the intended recipient. Codes expire after seven days."><Panel title="Private invitation code"><WorkspaceForm action="invite.accept" fields={[{name:'token',label:'Invitation code',minLength:64,maxLength:64}]} label="Accept invitation" redirectTo="/dashboard/workspaces"/></Panel></WorkspaceLayout>;}
