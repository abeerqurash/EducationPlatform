import {
  getStudentResultOverview,
} from "@education/database";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppIcon } from "@/components/app-shell/app-icon";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import {
  Eyebrow,
  Panel,
} from "@/components/app-shell/dashboard-ui";
import { SiteButton } from "@/components/app-shell/site-button";

export const metadata = {
  title: "My tools",
};

export default async function MyToolsPage() {
  const session = await auth();
  const userId =
    session?.user?.id?.trim();

  if (!session?.user || !userId) {
    redirect(
      "/login?callbackUrl=%2Fdashboard%2Ftools",
    );
  }

  const overview =
    await getStudentResultOverview(
      userId,
    );

  const recentTools =
    Array.from(
      new Map(
        overview.recentResults.map(
          (result) => [
            result.toolSlug,
            result,
          ],
        ),
      ).values(),
    );

  return (
    <DashboardShell
      userName={session.user.name}
      userEmail={session.user.email}
      active="My tools"
    >
      <div className="space-y-7">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <Eyebrow>
              <AppIcon name="calculator" className="h-3.5 w-3.5" />
              Calculator workspace
            </Eyebrow>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">
              My tools
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Quickly return to calculators represented in your recent saved activity.
            </p>
          </div>
          <SiteButton href="/tools">
            Explore all tools
            <AppIcon name="arrow" className="h-4 w-4" />
          </SiteButton>
        </section>

        <Panel
          title={`${overview.toolsUsed} ${overview.toolsUsed === 1 ? "tool" : "tools"} used`}
          description="This list is derived from your own saved calculator history."
        >
          {recentTools.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {recentTools.map((tool) => (
                <Link
                  key={tool.toolSlug}
                  href="/dashboard/saved"
                  className="group flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-violet-200 hover:bg-violet-50/50"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-50 text-violet-600">
                    <AppIcon name="calculator" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold text-slate-900">
                      {tool.toolName}
                    </span>
                    <span className="mt-1 block truncate text-[11px] text-slate-500">
                      {tool.summary}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div
              role="status"
              className="rounded-2xl border border-dashed border-slate-200 bg-[#fafafc] px-5 py-10 text-center"
            >
              <AppIcon name="calculator" className="mx-auto h-6 w-6 text-slate-400" />
              <p className="mt-4 text-sm font-extrabold text-slate-900">
                No tool activity yet
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Calculate and save a result to begin building your workspace.
              </p>
            </div>
          )}
        </Panel>
      </div>
    </DashboardShell>
  );
}
