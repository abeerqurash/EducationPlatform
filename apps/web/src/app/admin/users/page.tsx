import { AdminSectionPage } from "@/components/app-shell/admin-section-page";

export const metadata = {
  title: "Users & access",
};

export default function Page() {
  return (
    <AdminSectionPage
      active="Users & access"
      path="/admin/users"
      eyebrow="Access operations"
      title="Users & access"
      description="Manage platform access through server-owned roles and permissions as the dedicated user module is connected."
      icon="settings"
    />
  );
}
