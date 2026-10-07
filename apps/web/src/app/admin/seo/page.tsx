import { AdminSectionPage } from "@/components/app-shell/admin-section-page";

export const metadata = {
  title: "SEO workspace",
};

export default function Page() {
  return (
    <AdminSectionPage
      active="SEO"
      path="/admin/seo"
      eyebrow="Search operations"
      title="SEO workspace"
      description="Manage technical discoverability, structured content and search-health workflows."
      icon="target"
    />
  );
}
