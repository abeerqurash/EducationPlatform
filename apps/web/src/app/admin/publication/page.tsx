import Link from "next/link";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

import {
  resolvePublicationActor,
} from "../../../../../../packages/database/src/publication/actor-resolver";
import {
  publicationPermissions,
} from "../../../../../../packages/database/src/publication/authorization";
import {
  listAdminPublicationTools,
} from "../../../../../../packages/database/src/publication/admin-repository";

import {
  PublicationActions,
} from "./publication-actions";

function statusLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

type PublicationPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    verification?: string;
    sort?: string;
    page?: string;
  }>;
};

const publicationStatuses = [
  "all",
  "draft",
  "review",
  "scheduled",
  "published",
  "archived",
] as const;

const verificationStatuses = [
  "all",
  "unverified",
  "pending",
  "verified",
  "rejected",
  "outdated",
] as const;

const publicationSorts = [
  "updated",
  "name",
  "status",
  "verification",
] as const;

const PAGE_SIZE = 10;

function normalizePage(
  value: string | undefined,
) {
  const parsed = Number.parseInt(
    value ?? "1",
    10,
  );

  return Number.isFinite(parsed) &&
    parsed > 0
    ? parsed
    : 1;
}

function compareNullable(
  left: string | null,
  right: string | null,
) {
  return (left ?? "").localeCompare(
    right ?? "",
    undefined,
    {
      sensitivity: "base",
    },
  );
}

function buildPublicationHref(
  query: {
    q?: string;
    status: string;
    verification: string;
    sort: string;
  },
  page: number,
) {
  const params =
    new URLSearchParams();

  if (query.q?.trim()) {
    params.set(
      "q",
      query.q.trim(),
    );
  }

  if (query.status !== "all") {
    params.set(
      "status",
      query.status,
    );
  }

  if (
    query.verification !== "all"
  ) {
    params.set(
      "verification",
      query.verification,
    );
  }

  if (query.sort !== "updated") {
    params.set(
      "sort",
      query.sort,
    );
  }

  if (page > 1) {
    params.set(
      "page",
      String(page),
    );
  }

  const search =
    params.toString();

  return search
    ? `/admin/publication?${search}`
    : "/admin/publication";
}

function normalizeFilter(
  value: string | undefined,
  allowed: readonly string[],
) {
  return value && allowed.includes(value)
    ? value
    : "all";
}

export default async function AdminPublicationPage({
  searchParams,
}: PublicationPageProps) {
  const session = await auth();
  const userId = session?.user?.id?.trim();

  if (!userId) {
    redirect("/login?callbackUrl=/admin/publication");
  }

  const actor = await resolvePublicationActor(userId);

  const canSubmit = actor.permissionKeys.includes(
    publicationPermissions.submitForReview,
  );
  const canPublish = actor.permissionKeys.includes(
    publicationPermissions.publish,
  );

  if (!canSubmit && !canPublish) {
    redirect("/dashboard");
  }

  const publicationTools =
    await listAdminPublicationTools();

  const query =
    await searchParams;

  const search =
    query.q?.trim().toLowerCase() ??
    "";

  const status =
    normalizeFilter(
      query.status,
      publicationStatuses,
    );

  const verification =
    normalizeFilter(
      query.verification,
      verificationStatuses,
    );

  const sort =
    normalizeFilter(
      query.sort,
      publicationSorts,
    ) === "all"
      ? "updated"
      : normalizeFilter(
          query.sort,
          publicationSorts,
        );

  const requestedPage =
    normalizePage(query.page);

  const filteredTools =
    publicationTools.filter(
      (tool) => {
        const matchesSearch =
          !search ||
          tool.name
            .toLowerCase()
            .includes(search) ||
          tool.slug
            .toLowerCase()
            .includes(search) ||
          tool.categoryName
            ?.toLowerCase()
            .includes(search);

        const matchesStatus =
          status === "all" ||
          tool.status === status;

        const toolVerification =
          tool.calculatorVerificationStatus ??
          "unverified";

        const matchesVerification =
          verification === "all" ||
          toolVerification ===
            verification;

        return Boolean(
          matchesSearch &&
            matchesStatus &&
            matchesVerification,
        );
      },
    );

  const sortedTools =
    [...filteredTools].sort(
      (left, right) => {
        if (sort === "name") {
          return left.name.localeCompare(
            right.name,
            undefined,
            {
              sensitivity: "base",
            },
          );
        }

        if (sort === "status") {
          return left.status.localeCompare(
            right.status,
          );
        }

        if (
          sort === "verification"
        ) {
          return compareNullable(
            left.calculatorVerificationStatus,
            right.calculatorVerificationStatus,
          );
        }

        // Repository order is already newest-updated first.
        return (
          publicationTools.indexOf(
            left,
          ) -
          publicationTools.indexOf(
            right,
          )
        );
      },
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        sortedTools.length /
          PAGE_SIZE,
      ),
    );

  const currentPage =
    Math.min(
      requestedPage,
      totalPages,
    );

  const pageStart =
    (currentPage - 1) *
    PAGE_SIZE;

  const visibleTools =
    sortedTools.slice(
      pageStart,
      pageStart +
        PAGE_SIZE,
    );

  const paginationQuery = {
    q: query.q,
    status,
    verification,
    sort,
  };

  const statusCounts =
    publicationTools.reduce<
      Record<string, number>
    >(
      (counts, tool) => {
        counts[tool.status] =
          (counts[tool.status] ?? 0) +
          1;

        return counts;
      },
      {},
    );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Editorial control
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Publication management
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review calculator publication state and the
              actions available to your account.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {canSubmit ? (
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-indigo-700">
                Submit for review
              </span>
            ) : null}
            {canPublish ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700">
                Publish
              </span>
            ) : null}
          </div>
        </header>

        <section
          aria-label="Publication summary"
          className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {publicationStatuses
            .filter(
              (item) =>
                item !== "all",
            )
            .map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {statusLabel(item)}
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {statusCounts[item] ?? 0}
                </p>
              </div>
            ))}
        </section>

        <form
          method="get"
          className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(220px,1fr)_170px_170px_150px_auto]"
        >
          <label className="block">
            <span className="sr-only">
              Search publication tools
            </span>
            <input
              type="search"
              name="q"
              defaultValue={query.q ?? ""}
              placeholder="Search tool, slug or category"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="sr-only">
              Publication status
            </span>
            <select
              name="status"
              defaultValue={status}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {publicationStatuses.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === "all"
                      ? "All publication states"
                      : statusLabel(item)}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">
              Verification status
            </span>
            <select
              name="verification"
              defaultValue={verification}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {verificationStatuses.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === "all"
                      ? "All verification states"
                      : statusLabel(item)}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">
              Sort publication tools
            </span>
            <select
              name="sort"
              defaultValue={sort}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="updated">
                Recently updated
              </option>
              <option value="name">
                Tool name
              </option>
              <option value="status">
                Publication status
              </option>
              <option value="verification">
                Verification
              </option>
            </select>
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              className="h-11 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Filter
            </button>
            <Link
              href="/admin/publication"
              className="flex h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Reset
            </Link>
          </div>
        </form>

        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            Showing{" "}
            <span className="font-semibold text-slate-950">
              {filteredTools.length}
            </span>{" "}
            matching of{" "}
            <span className="font-semibold text-slate-950">
              {publicationTools.length}
            </span>{" "}
            total tools
          </p>
        </div>

        <section
          aria-label="Publication tools"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Tool",
                    "Category",
                    "Version",
                    "Verification",
                    "Status",
                    "Last reviewed",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visibleTools.length ? (
                  visibleTools.map((tool) => (
                    <tr
                      key={tool.id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-950">
                          {tool.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {tool.slug}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {tool.categoryName ?? "Uncategorized"}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {tool.currentVersion ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {statusLabel(
                            tool.calculatorVerificationStatus ??
                              "unverified",
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                          {statusLabel(tool.status)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {tool.lastReviewedAt
                          ? tool.lastReviewedAt.toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "Not reviewed"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/admin/publication/${tool.id}`}
                            className="text-xs font-semibold text-indigo-700 hover:text-indigo-900"
                          >
                            View readiness
                          </Link>
                          <PublicationActions
                            toolId={tool.id}
                            toolName={tool.name}
                            status={tool.status}
                            canSubmit={canSubmit}
                            canPublish={canPublish}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      No publication tools match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {filteredTools.length >
        PAGE_SIZE ? (
          <nav
            aria-label="Publication pagination"
            className="mt-5 flex items-center justify-between gap-4"
          >
            <p className="text-sm text-slate-600">
              Page{" "}
              <span className="font-semibold text-slate-950">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-950">
                {totalPages}
              </span>
            </p>

            <div className="flex gap-2">
              {currentPage > 1 ? (
                <Link
                  href={buildPublicationHref(
                    paginationQuery,
                    currentPage - 1,
                  )}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Previous
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400"
                >
                  Previous
                </span>
              )}

              {currentPage <
              totalPages ? (
                <Link
                  href={buildPublicationHref(
                    paginationQuery,
                    currentPage + 1,
                  )}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Next
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400"
                >
                  Next
                </span>
              )}
            </div>
          </nav>
        ) : null}
      </div>
    </main>
  );
}
