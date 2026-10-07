import { AdminSectionPage } from "@/components/app-shell/admin-section-page";

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
      description="Prepare the operator workspace for helpdesk conversations and customer support workflows."
      icon="help"
    />
  );
}
