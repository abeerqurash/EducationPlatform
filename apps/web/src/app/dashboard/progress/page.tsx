import { DashboardSectionPage } from "@/components/app-shell/dashboard-section-page";

export const metadata = {
  title: "Progress",
};

export default function Page() {
  return (
    <DashboardSectionPage
      active="Progress"
      eyebrow="Progress workspace"
      title="Progress"
      description="Track real calculator, practice and study activity as progress persistence comes online."
      icon="chart"
      actionHref="/tools"
      actionLabel="Start an activity"
    />
  );
}
