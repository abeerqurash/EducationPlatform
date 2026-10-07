import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";

import { auth } from "@/auth";

import {
  resolvePublicationActor,
} from "../../../../../../../packages/database/src/publication/actor-resolver";
import {
  publicationPermissions,
} from "../../../../../../../packages/database/src/publication/authorization";
import {
  getAdminPublicationDetail,
} from "../../../../../../../packages/database/src/publication/admin-detail-repository";

import {
  PublicationActions,
} from "../publication-actions";

type PageProps = {
  params: Promise<{
    toolId: string;
  }>;
};

function label(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function StatusCard({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-950">
        {label(value)}
      </p>
      {note ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {note}
        </p>
      ) : null}
    </div>
  );
}

export default async function AdminPublicationDetailPage({
  params,
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id?.trim();

  if (!userId) {
    redirect("/login?callbackUrl=/admin/publication");
  }

  const actor =
    await resolvePublicationActor(userId);

  const canSubmit =
    actor.permissionKeys.includes(
      publicationPermissions.submitForReview,
    );
  const canPublish =
    actor.permissionKeys.includes(
      publicationPermissions.publish,
    );

  if (!canSubmit && !canPublish) {
    redirect("/dashboard");
  }

  const { toolId } = await params;
  const detail =
    await getAdminPublicationDetail(toolId);

  if (!detail) notFound();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin/publication"
          className="text-sm font-medium text-indigo-700 hover:text-indigo-900"
        >
          ← Publication management
        </Link>

        <header className="mt-5 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Publication readiness
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {detail.tool.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {detail.tool.slug}
              {detail.tool.currentVersion
                ? ` · Version ${detail.tool.currentVersion}`
                : ""}
            </p>
          </div>

          <PublicationActions
            toolId={detail.tool.id}
            toolName={detail.tool.name}
            status={detail.tool.status}
            canSubmit={canSubmit}
            canPublish={canPublish}
          />
        </header>

        <section
          aria-label="Publication context"
          className="mt-7 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Category
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {detail.tool.categoryName ??
                "Uncategorized"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Applicable year
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {detail.tool.applicableYear ??
                "Not set"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active version
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {detail.calculatorVersion
                ?.version ??
                "Missing"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Last reviewed
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {detail.tool.lastReviewedAt
                ? detail.tool.lastReviewedAt.toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )
                : "Not reviewed"}
            </p>
          </div>
        </section>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            title="Publication"
            value={detail.tool.status}
          />
          <StatusCard
            title="Calculator"
            value={
              detail.calculatorVersion
                ?.verificationStatus ??
              "missing"
            }
          />
          <StatusCard
            title="Formula"
            value={
              detail.formula
                ?.verificationStatus ??
              "missing"
            }
            note={
              detail.formula?.version
                ? `Version ${detail.formula.version}`
                : "No active formula version"
            }
          />
          <StatusCard
            title="Latest review"
            value={
              detail.latestReview?.status ??
              "missing"
            }
            note={
              detail.latestReview
                ?.reviewedAt
                ? `Reviewed ${detail.latestReview.reviewedAt.toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )}`
                : "No completed review date"
            }
          />
        </section>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Editorial gate
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  Publication readiness
                </h2>
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  detail.readiness?.canPublish
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {detail.readiness?.canPublish
                  ? "Ready"
                  : "Blocked"}
              </span>
            </div>

            {!detail.readiness ? (
              <p className="mt-5 text-sm leading-6 text-slate-600">
                No active calculator version is available for the current tool version.
              </p>
            ) : detail.readiness.issues.length ? (
              <ul className="mt-5 space-y-3">
                {detail.readiness.issues.map(
                  (issue) => (
                    <li
                      key={issue.code}
                      className="rounded-xl border border-amber-200 bg-amber-50 p-4"
                    >
                      <p className="text-sm font-semibold text-amber-900">
                        {label(issue.code)}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-amber-800">
                        {issue.message}
                      </p>
                    </li>
                  ),
                )}
              </ul>
            ) : (
              <p className="mt-5 text-sm leading-6 text-emerald-700">
                The current editorial state satisfies the publication gate.
              </p>
            )}
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Review record
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">
                Latest editorial review
              </h2>

              {detail.latestReview ? (
                <dl className="mt-5 space-y-4">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-950">
                      {label(
                        detail.latestReview.status,
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Reviewed
                    </dt>
                    <dd className="mt-1 text-sm text-slate-700">
                      {detail.latestReview
                        .reviewedAt
                        ? detail.latestReview.reviewedAt.toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            },
                          )
                        : "No completed review date"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Reviewer
                    </dt>
                    <dd className="mt-1 break-all text-sm text-slate-700">
                      {detail.latestReview
                        .reviewerId ??
                        "Not assigned"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Notes
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {detail.latestReview
                        .notes?.trim() ||
                        "No review notes"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Review record
                    </dt>
                    <dd className="mt-1 break-all font-mono text-xs text-slate-500">
                      {detail.latestReview.id}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-5 text-sm leading-6 text-slate-600">
                  No calculator-version review record is available.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Evidence
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              Linked sources
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                {detail.evidenceSummary.totalSources} linked
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                {detail.evidenceSummary.verifiedSources} verified
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                {detail.evidenceSummary.totalSources -
                  detail.evidenceSummary.verifiedSources} not verified
              </span>
            </div>

            {detail.sources.length ? (
              <div className="mt-5 space-y-3">
                {detail.sources.map(
                  (source) => (
                    <div
                      key={source.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {source.title}
                          </p>
                          {source.publisher ? (
                            <p className="mt-1 text-xs text-slate-500">
                              {source.publisher}
                            </p>
                          ) : null}
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {label(
                            source.verificationStatus,
                          )}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-500">
                No sources are linked to the active calculator version.
              </p>
            )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
