import { AdminSectionPage } from "@/components/app-shell/admin-section-page";

export const metadata = {
  title: "Settings",
};

export default function Page() {
  return (
    <AdminSectionPage
      active="Settings"
      path="/admin/settings"
      eyebrow="Platform configuration"
      title="Settings"
      description="Centralize protected platform configuration without exposing operational controls to customer accounts."
      icon="settings"
    />
  );
}
