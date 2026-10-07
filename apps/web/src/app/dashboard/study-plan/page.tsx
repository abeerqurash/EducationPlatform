import { DashboardSectionPage } from "@/components/app-shell/dashboard-section-page";

export const metadata = {
  title: "Study plan",
};

export default function Page() {
  return (
    <DashboardSectionPage
      active="Study plan"
      eyebrow="Planning workspace"
      title="Study plan"
      description="Build a focused study routine around your academic goals and upcoming assessments."
      icon="book"
      actionHref="/tools"
      actionLabel="Choose a study tool"
    />
  );
}
