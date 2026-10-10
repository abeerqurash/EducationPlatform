import { parentSharing } from '@education/database/learning-workspaces';
import { accountSession } from '@/lib/auth/account-http';
import { workspaceDownload,workspaceDownloadFailure } from '@/lib/workspace-download';
export async function GET(){try{const user=await accountSession();const data=await parentSharing({id:user.id!,authVersion:user.authVersion!});return workspaceDownload(JSON.stringify({exportedAt:new Date().toISOString(),windowDays:30,metric:'Practice percent correct; not an official exam score',summaries:data.summaries},null,2),'shared-practice-summaries.json','application/json');}catch(error){return workspaceDownloadFailure(error);}}
