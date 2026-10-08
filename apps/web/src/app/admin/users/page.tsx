import {
  getAdminAccessSummary,
  getPlatformAdminBootstrapState,
  listAccessAudit,
  listAdminUsers,
  listAssignableAdminRoles,
} from "@education/database";

import {
  assignUserRoleAction,
  bootstrapPlatformAdminAction,
  removeUserRoleAction,
  setUserActiveStateAction,
} from "@/app/actions/admin-access";
import { AdminShell } from "@/components/app-shell/admin-shell";
import {
  Eyebrow,
  MetricCard,
  Panel,
} from "@/components/app-shell/dashboard-ui";
import { AppIcon } from "@/components/app-shell/app-icon";
import { requireAdminWorkspaceAccess } from "@/lib/admin-workspace-access";

export const metadata = {
  title: "Users & access",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const access = await requireAdminWorkspaceAccess("/admin/users");
  const params = await searchParams;
  const query = (params.q?.trim() ?? "").slice(0, 160);
  const requestedPage = Math.max(1, Math.min(100000, Number.parseInt(params.page ?? "1", 10) || 1));
  const limit = 25;

  const [directory, summary, audit, roles, bootstrap] =
    await Promise.all([
      listAdminUsers({
        query,
        limit,
        offset: (requestedPage - 1) * limit,
      }),
      getAdminAccessSummary(),
      listAccessAudit(20),
      listAssignableAdminRoles(),
      getPlatformAdminBootstrapState(),
    ]);

  const canManage = access.accessMode === "dedicated";
  const canBootstrap =
    access.accessMode === "publication-compatibility" &&
    bootstrap.seeded &&
    bootstrap.needsFirstAdmin;
  const totalPages = Math.max(1, Math.ceil(directory.total / limit));
  const page = Math.min(requestedPage, totalPages);

  return (
    <AdminShell
      userName={access.user.name}
      userEmail={access.user.email}
      active="Users & access"
    >
      <div className="space-y-7">
        <section>
          <Eyebrow>
            <AppIcon name="settings" className="h-3.5 w-3.5" />
            Access operations
          </Eyebrow>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">
            Users & access
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage persisted roles, account access and administrator authority with an auditable trail.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Users" value={String(summary.totalUsers)} note="Registered accounts" icon="settings" />
          <MetricCard label="Platform admins" value={String(summary.dedicatedAdmins)} note="Dedicated administrators" icon="settings" />
          <MetricCard label="RBAC roles" value={String(summary.totalRoles)} note="Assignable roles" icon="target" />
          <MetricCard label="Inactive" value={String(summary.inactiveUsers)} note="Blocked from login" icon="help" />
        </section>

        {canBootstrap ? (
          <Panel
            title="Complete administrator bootstrap"
            description="No dedicated platform administrator exists yet."
          >
            <p className="mb-4 max-w-2xl text-sm leading-6 text-slate-600">
              Your current publication-compatible account may claim the first platform-admin role exactly once. After that, all privilege changes require dedicated administrator permission.
            </p>
            <form action={bootstrapPlatformAdminAction} className="flex flex-col gap-3 sm:flex-row">
              <input
                required
                minLength={8}
                maxLength={500}
                name="reason" aria-label="Reason for this access change"
                placeholder="Reason for first-admin bootstrap"
                className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
              />
              <button className="button button--primary" type="submit">
                Become first platform admin
              </button>
            </form>
          </Panel>
        ) : null}

        {!canManage && !canBootstrap ? (
          <div role="status" className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            You are using publication-compatibility access. User access remains read-only because dedicated platform administration has already been established or its RBAC seed is not installed.
          </div>
        ) : null}

        <Panel title="Account directory" description={`${directory.total} matching accounts`}>
          <form method="get" className="mb-5 flex gap-2">
            <input
              name="q"
              aria-label="Search accounts by name or email"
              maxLength={160}
              defaultValue={query}
              placeholder="Search name or email"
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />
            <button className="button button--secondary" type="submit">Search</button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="px-3 py-3">Account</th>
                  <th className="px-3 py-3">Roles</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Role management</th>
                  <th className="px-3 py-3">Account access</th>
                </tr>
              </thead>
              <tbody>
                {directory.users.map((account) => (
                  <tr key={account.id} className="border-b border-slate-100 align-top">
                    <td className="px-3 py-4">
                      <p className="font-bold text-slate-900">{account.name || "Unnamed account"}</p>
                      <p className="mt-1 text-xs text-slate-500">{account.email || "No email"}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">{account.accountRole}</p>
                    </td>
                    <td className="px-3 py-4 text-xs text-slate-600">
                      {account.roles.length
                        ? account.roles.map((role) => role.name).join(", ")
                        : "No RBAC roles"}
                    </td>
                    <td className="px-3 py-4 text-xs font-bold">
                      {account.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-3 py-4">
                      {canManage ? (
                        <div className="space-y-3">
                          <form action={assignUserRoleAction} className="space-y-2">
                            <input type="hidden" name="targetUserId" value={account.id} />
                            <select required name="roleKey" aria-label="Choose a role" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs">
                              <option value="">Assign role…</option>
                              {roles
                                .filter((role) => !account.roles.some((current) => current.key === role.key))
                                .map((role) => (
                                  <option key={role.id} value={role.key}>{role.name}</option>
                                ))}
                            </select>
                            <input required minLength={8} maxLength={500} name="reason" aria-label="Reason for this access change" placeholder="Reason required" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" />
                            <button type="submit" className="button button--secondary" disabled={!account.isActive || account.roles.length === roles.length}>Assign</button>
                          </form>

                          {account.roles.length ? (
                            <form action={removeUserRoleAction} className="space-y-2">
                              <input type="hidden" name="targetUserId" value={account.id} />
                              <select required name="roleKey" aria-label="Choose a role" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs">
                                <option value="">Remove role…</option>
                                {account.roles.map((role) => (
                                  <option key={role.key} value={role.key}>{role.name}</option>
                                ))}
                              </select>
                              <input required minLength={8} maxLength={500} name="reason" aria-label="Reason for this access change" placeholder="Reason required" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" />
                              <button type="submit" className="button button--secondary" disabled={account.id === access.user.id && account.roles.length === 1 && account.roles[0]?.key === "platform_admin"}>Remove</button>
                            </form>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">Read only</span>
                      )}
                    </td>
                    <td className="px-3 py-4">
                      {canManage ? (
                        <form action={setUserActiveStateAction} className="space-y-2">
                          <input type="hidden" name="targetUserId" value={account.id} />
                          <input type="hidden" name="active" value={account.isActive ? "false" : "true"} />
                          <input required minLength={8} maxLength={500} name="reason" aria-label="Reason for this access change" placeholder="Reason required" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" />
                          <button type="submit" className="button button--secondary" disabled={account.isActive && account.id === access.user.id}>
                            {account.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </form>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">Read only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              {page > 1 ? (
                <a className="rounded-full border border-slate-200 px-3 py-2" href={`?q=${encodeURIComponent(query)}&page=${page - 1}`}>Previous</a>
              ) : null}
              {page < totalPages ? (
                <a className="rounded-full border border-slate-200 px-3 py-2" href={`?q=${encodeURIComponent(query)}&page=${page + 1}`}>Next</a>
              ) : null}
            </div>
          </div>
        </Panel>

        <Panel title="Access audit" description="Recent persisted role and account-access changes">
          {audit.length ? (
            <div className="divide-y divide-slate-100">
              {audit.map((entry) => (
                <article key={entry.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-xs font-bold text-slate-900">{entry.message || "Access change"}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {entry.createdAt.toLocaleString()} · Actor {entry.actorUserId ?? "system"}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p role="status" className="text-sm text-slate-500">No access changes recorded yet.</p>
          )}
        </Panel>
      </div>
    </AdminShell>
  );
}
