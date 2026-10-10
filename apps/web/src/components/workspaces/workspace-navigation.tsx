'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dashboardAction,dashboardActionPrimary } from '@/components/shared/dashboard-action-styles';
const items=[['Classrooms','/dashboard/workspaces'],['Parent sharing','/dashboard/workspaces/parents'],['Accept invitation','/dashboard/workspaces/invitations'],['Support tickets','/dashboard/workspaces/support']] as const;
export function WorkspaceNavigation(){
 const pathname=usePathname();
 const active=pathname.includes('/parents')?items[1][1]:pathname.includes('/invitations')?items[2][1]:pathname.includes('/support')||pathname.includes('/staff-support')?items[3][1]:items[0][1];
 return <nav aria-label="Workspaces" className="flex flex-wrap gap-2 rounded-2xl border border-[#dfe0d5] bg-[#f7f8f2] p-2">{items.map(([label,href])=><Link key={href} href={href} aria-current={href===active?'page':undefined} className={href===active?dashboardActionPrimary:dashboardAction}>{label}</Link>)}</nav>;
}
