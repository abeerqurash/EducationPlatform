import 'server-only';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
export async function workspaceSession(){const session=await auth();if(!session?.user?.id||typeof session.user.authVersion!=='number')redirect('/login?callbackUrl=%2Fdashboard%2Fworkspaces');return {user:session.user,actor:{id:session.user.id,authVersion:session.user.authVersion}};}
