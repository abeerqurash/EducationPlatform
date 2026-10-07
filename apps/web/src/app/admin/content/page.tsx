import { AdminSectionPage } from "@/components/app-shell/admin-section-page";

export const metadata = {
  title: "Content",
};

export default function Page() {
  return (
    <AdminSectionPage
      active="Content"
      path="/admin/content"
      eyebrow="Content operations"
      title="Content"
      description="Prepare educational resources, guides and future editorial content workflows."
      icon="bookmark"
    />
  );
}
