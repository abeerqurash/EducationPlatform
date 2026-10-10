import { classroomDetail } from '@education/database/learning-workspaces';
import { classroomGradebook } from '@education/database/learning-workspaces/reports';
import { accountSession } from '@/lib/auth/account-http';
import { workspaceDownload,workspaceDownloadFailure } from '@/lib/workspace-download';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;const user=await accountSession();const data=await classroomDetail({id:user.id!,authVersion:user.authVersion!},id,true);return workspaceDownload(classroomGradebook(data),'classroom-gradebook.csv','text/csv');}catch(error){return workspaceDownloadFailure(error);}}
