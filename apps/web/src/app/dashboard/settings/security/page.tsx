import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAccountSecurity } from '@education/database/account-security';
import { DashboardShell } from '@/components/app-shell/dashboard-shell';
import { Panel } from '@/components/app-shell/dashboard-ui';
import { ChangePasswordForm } from '@/components/account/change-password-form';
import { RevokeSessionsForm } from '@/components/account/revoke-sessions-form';
import { SecurityEventList } from '@/components/account/security-event-list';
import { SecurityStatus } from '@/components/account/security-status';
export const metadata={title:'Account security',robots:{index:false,follow:false}};
export default async function Page(){
 const session=await auth();if(!session?.user?.id)redirect('/login?callbackUrl=%2Fdashboard%2Fsettings%2Fsecurity');
 const data=await getAccountSecurity(session.user.id);
 return <DashboardShell active="Settings" userName={session.user.name} userEmail={session.user.email}><div className="space-y-7"><div><h1 className="text-3xl font-extrabold">Account security</h1><p className="mt-2 text-sm text-slate-500">Manage your password, email status and account sessions.</p><Link className="mt-3 inline-block text-sm underline" href="/dashboard/settings">Back to settings</Link></div><Panel title="Account status"><SecurityStatus verifiedAt={data.account.emailVerifiedAt?.toISOString()??null} passwordChangedAt={data.account.passwordChangedAt?.toISOString()??null} lastLoginAt={data.account.lastLoginAt?.toISOString()??null}/></Panel><Panel title="Change your password" description="Your current password is required. Every existing session will end."><ChangePasswordForm/></Panel><Panel title="Sign out all sessions"><RevokeSessionsForm/></Panel><Panel title="Recent security activity" description="Most recent 50 events; timestamps are UTC." action={<Link className="text-sm underline" href="/dashboard/settings/security/export">Download JSON</Link>}><SecurityEventList events={data.events.map(e=>({...e,createdAt:e.createdAt.toISOString()}))}/></Panel></div></DashboardShell>;
}
