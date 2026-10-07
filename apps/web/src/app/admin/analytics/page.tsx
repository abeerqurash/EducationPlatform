import { AdminSectionPage } from "@/components/app-shell/admin-section-page";

export const metadata = {
  title: "Analytics",
};

export default function Page() {
  return (
    <AdminSectionPage
      active="Analytics"
      path="/admin/analytics"
      eyebrow="Growth intelligence"
      title="Analytics"
      description="Review first-party product and acquisition signals as analytics pipelines are connected."
      icon="chart"
    />
  );
}
