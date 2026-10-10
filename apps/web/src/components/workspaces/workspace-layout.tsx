import { WorkspaceNavigation } from './workspace-navigation';
import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/app-shell/dashboard-shell';
export function WorkspaceLayout({user,title,description,children}:{user:{name?:string|null;email?:string|null};title:string;description:string;children:ReactNode}){return <DashboardShell active="Workspaces" userName={user.name} userEmail={user.email}><div className="space-y-6"><div><h1 className="text-3xl font-extrabold">{title}</h1><p className="mt-2 text-sm text-[#5f6555]">{description}</p></div><WorkspaceNavigation/>{children}</div></DashboardShell>;}
