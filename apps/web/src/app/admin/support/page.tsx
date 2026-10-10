import { AdminSectionPage } from "@/components/app-shell/admin-section-page";
import { Panel } from '@/components/app-shell/dashboard-ui';

export const metadata = {
  title: "Support",
};

export default function Page() {
  return (
    <AdminSectionPage
      active="Support"
      path="/admin/support"
      eyebrow="Support operations"
      title="Support"
      description="Manage private customer conversations through the scoped support inbox."
      icon="help"
      actionHref="/dashboard/workspaces/staff-support"
      actionLabel="Open support inbox"
    ><Panel title="Private support conversations" description="Assign the Support workspace role to operators who should read and reply to tickets."><p className="text-sm text-slate-600">Customers can create, reply to, close, reopen, and download their own conversations. Staff access is checked against the support permission on every request. Replies appear in the application; email notifications are disabled.</p></Panel></AdminSectionPage>
  );
}
