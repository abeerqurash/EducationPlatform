import { AdminSectionPage } from "@/components/app-shell/admin-section-page";

export const metadata = {
  title: "Tools & calculators",
};

export default function Page() {
  return (
    <AdminSectionPage
      active="Tools & calculators"
      path="/admin/tools"
      eyebrow="Tool operations"
      title="Tools & calculators"
      description="Manage calculator definitions, versions and datasets through protected platform workflows."
      icon="calculator"
    />
  );
}
