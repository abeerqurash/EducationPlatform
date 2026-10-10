import { supportTicketDetail } from '@education/database/learning-workspaces';
import { accountSession } from '@/lib/auth/account-http';
import { workspaceDownload,workspaceDownloadFailure } from '@/lib/workspace-download';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;const user=await accountSession();const data=await supportTicketDetail({id:user.id!,authVersion:user.authVersion!},id);return workspaceDownload(JSON.stringify({exportedAt:new Date().toISOString(),...data},null,2),'support-conversation.json','application/json');}catch(error){return workspaceDownloadFailure(error);}}
