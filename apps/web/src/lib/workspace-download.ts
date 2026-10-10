import { accountFailure } from '@/lib/auth/account-http';
import { WorkspaceError } from '@education/database/learning-workspaces/contract';
export function workspaceDownload(body:string,filename:string,type:string){return new Response(body,{headers:{'Content-Type':`${type}; charset=utf-8`,'Content-Disposition':`attachment; filename="${filename}"`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
export function workspaceDownloadFailure(error:unknown){if(error instanceof WorkspaceError)return Response.json({error:'Workspace unavailable.'},{status:403,headers:{'Cache-Control':'no-store'}});return accountFailure(error);}
