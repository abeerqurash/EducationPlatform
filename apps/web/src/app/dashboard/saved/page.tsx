import {
  listStudentResults,
} from "@education/database";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppIcon } from "@/components/app-shell/app-icon";
import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import {
  Eyebrow,
  Panel,
} from "@/components/app-shell/dashboard-ui";
import { SiteButton } from "@/components/app-shell/site-button";
import { DeleteSavedResultButton } from "@/components/dashboard/delete-saved-result-button";

export const metadata = {
  title: "Saved results",
};

export default async function SavedResultsPage() {
  const session = await auth();
  const userId = session?.user?.id?.trim();

  if (!session?.user || !userId) {
    redirect(
      "/login?callbackUrl=%2Fdashboard%2Fsaved",
    );
  }

  const results =
    await listStudentResults(userId, 50);

  return (
    <DashboardShell
      userName={session.user.name}
      userEmail={session.user.email}
      active="Saved results"
    >
      <div className="space-y-7">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <Eyebrow>
              <AppIcon name="bookmark" className="h-3.5 w-3.5" />
              Saved workspace
            </Eyebrow>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">
              Saved results
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Your saved calculator outcomes stay private to your account and are ordered newest first.
            </p>
          </div>
          <SiteButton href="/tools">
            Create a result
            <AppIcon name="arrow" className="h-4 w-4" />
          </SiteButton>
        </section>

        <Panel
          title={`${results.length} saved ${results.length === 1 ? "result" : "results"}`}
          description="Up to your 50 most recent saved calculations are shown."
        >
          {results.length === 0 ? (
            <div
              role="status"
              className="rounded-2xl border border-dashed border-slate-200 bg-[#fafafc] px-5 py-10 text-center"
            >
              <AppIcon name="bookmark" className="mx-auto h-6 w-6 text-slate-400" />
              <p className="mt-4 text-sm font-extrabold text-slate-900">
                No saved results yet
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Save controls are being connected to production calculators.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {results.map((result) => (
                <article
                  key={result.id}
                  className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-50 text-slate-600">
                    <AppIcon name="calculator" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-extrabold text-slate-950">
                      {result.toolName}
                    </h2>
                    <p className="mt-1 text-xs text-slate-600">
                      {result.summary}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {result.createdAt.toLocaleString("en", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <DeleteSavedResultButton
                    resultId={result.id}
                  />
                </article>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </DashboardShell>
  );
}
