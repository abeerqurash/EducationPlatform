import type { ReactNode } from "react";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { AppIcon } from "./app-icon";
import { DashboardShell } from "./dashboard-shell";
import { Eyebrow, Panel } from "./dashboard-ui";
import { SiteButton } from "./site-button";

type DashboardSectionPageProps = {
  active: string;
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: Parameters<typeof AppIcon>[0]["name"];
  children?: ReactNode;
  actionHref?: string;
  actionLabel?: string;
};

export async function DashboardSectionPage({
  active,
  path,
  eyebrow,
  title,
  description,
  icon,
  children,
  actionHref = "/tools",
  actionLabel = "Browse tools",
}: DashboardSectionPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(path)}`,
    );
  }

  return (
    <DashboardShell
      userName={session.user.name}
      userEmail={session.user.email}
      active={active}
    >
      <div className="space-y-7">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <Eyebrow>
              <AppIcon name={icon} className="h-3.5 w-3.5" />
              {eyebrow}
            </Eyebrow>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
          <SiteButton href={actionHref} className="self-start md:self-auto">
            {actionLabel}
            <AppIcon name="arrow" className="h-4 w-4" />
          </SiteButton>
        </section>

        {children ?? (
          <Panel
            title="Your workspace is ready"
            description="Activity will appear here as you use Education Platform."
          >
            <div
              role="status"
              className="rounded-2xl border border-dashed border-slate-200 bg-[#fafafc] px-5 py-10 text-center"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-500 shadow-sm">
                <AppIcon name={icon} className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm font-extrabold text-slate-900">
                Nothing to show yet
              </p>
              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
                We won&apos;t invent account activity. Real saved data and progress will populate this area as those persistence modules are connected.
              </p>
            </div>
          </Panel>
        )}
      </div>
    </DashboardShell>
  );
}
