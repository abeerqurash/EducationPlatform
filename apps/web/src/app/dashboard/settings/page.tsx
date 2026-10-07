import { DashboardSectionPage } from "@/components/app-shell/dashboard-section-page";

export const metadata = {
  title: "Account settings",
};

export default function Page() {
  return (
    <DashboardSectionPage
      active="Settings"
      eyebrow="Account workspace"
      title="Account settings"
      description="Manage the student workspace preferences that are available to your account."
      icon="settings"
      actionHref="/dashboard"
      actionLabel="Back to overview"
    />
  );
}
