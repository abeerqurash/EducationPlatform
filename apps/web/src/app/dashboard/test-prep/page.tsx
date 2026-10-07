import { DashboardSectionPage } from "@/components/app-shell/dashboard-section-page";

export const metadata = {
  title: "Test prep",
};

export default function Page() {
  return (
    <DashboardSectionPage
      active="Test prep"
      eyebrow="Preparation workspace"
      title="Test prep"
      description="Keep SAT, ACT and future exam-prep activity organized in one place."
      icon="target"
      actionHref="/tools/test-prep"
      actionLabel="Explore test-prep tools"
    />
  );
}
