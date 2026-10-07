import { AdminSectionPage } from "@/components/app-shell/admin-section-page";

export const metadata = {
  title: "Monetization",
};

export default function Page() {
  return (
    <AdminSectionPage
      active="Monetization"
      path="/admin/monetization"
      eyebrow="Revenue operations"
      title="Monetization"
      description="Coordinate advertising, affiliate and future subscription surfaces without mixing them into editorial logic."
      icon="sparkles"
    />
  );
}
