import { getStudentWorkspace } from "@education/database";
import { redirect } from "next/navigation";

import { saveStudentProfileAction } from "@/app/actions/student-intelligence";
import { auth } from "@/auth";
import { AppIcon } from "@/components/app-shell/app-icon";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { Eyebrow, Panel } from "@/components/app-shell/dashboard-ui";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) {
    redirect("/login?callbackUrl=%2Fdashboard%2Fsettings");
  }

  const { profile } = await getStudentWorkspace(userId);

  return (
    <DashboardShell userName={session.user.name} userEmail={session.user.email} active="Settings">
      <div className="space-y-7">
        <div>
          <Eyebrow><AppIcon name="settings" className="h-3.5 w-3.5" /> Preferences</Eyebrow>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">Settings</h1>
          <p className="mt-2 text-sm text-slate-500">Manage study preferences stored with your account.</p>
        </div>

        <Panel title="Study preferences" description="These settings are server-owned and account scoped.">
          <form action={saveStudentProfileAction} className="max-w-2xl space-y-5">
            <label className="block text-xs font-bold text-slate-700">
              Timezone
              <input name="timezone" maxLength={80} defaultValue={profile?.timezone ?? "UTC"}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            </label>
            <label className="block text-xs font-bold text-slate-700">
              Weekly study target (minutes)
              <input name="weeklyStudyTargetMinutes" type="number" min="0" max="10080"
                defaultValue={profile?.weeklyStudyTargetMinutes ?? 300}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            </label>
            <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <input name="emailStudyReminders" type="checkbox"
                defaultChecked={profile?.emailStudyReminders ?? false}
                className="h-4 w-4 rounded border-slate-300" />
              Email study reminders when delivery is connected
            </label>
            <button className="button button--primary" type="submit">Save preferences</button>
          </form>
        </Panel>
      </div>
    </DashboardShell>
  );
}
