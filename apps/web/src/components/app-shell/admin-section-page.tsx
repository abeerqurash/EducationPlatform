import type { ReactNode } from "react";

import { requireAdminWorkspaceAccess } from "@/lib/admin-workspace-access";

import { AdminShell } from "./admin-shell";
import { AppIcon } from "./app-icon";
import { Eyebrow, Panel } from "./dashboard-ui";
import { SiteButton } from "./site-button";

type AdminSectionPageProps = {
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

export async function AdminSectionPage({
  active,
  path,
  eyebrow,
  title,
  description,
  icon,
  children,
  actionHref = "/admin/publication",
  actionLabel = "Publication queue",
}: AdminSectionPageProps) {
  const { user } = await requireAdminWorkspaceAccess(path);

  return (
    <AdminShell
      userName={user.name}
      userEmail={user.email}
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
          <SiteButton
            href={actionHref}
            variant="secondary"
            className="self-start md:self-auto"
          >
            {actionLabel}
            <AppIcon name="arrow" className="h-4 w-4" />
          </SiteButton>
        </section>

        {children ?? (
          <Panel
            title={`${title} foundation`}
            description="This module is protected and ready for its data workflows."
          >
            <div
              role="status"
              className="rounded-2xl border border-dashed border-slate-200 bg-[#fafafc] px-5 py-10 text-center"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-500 shadow-sm">
                <AppIcon name={icon} className="h-5 w-5" />
              </span>
              <p className="mt-4 text-sm font-extrabold text-slate-900">
                Protected module ready
              </p>
              <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-slate-500">
                No operational metrics are fabricated. Real controls and data will appear here as this module is connected to its server-owned services.
              </p>
            </div>
          </Panel>
        )}
      </div>
    </AdminShell>
  );
}
