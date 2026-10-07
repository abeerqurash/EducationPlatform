import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/app-shell/admin-shell";
import { AppIcon } from "@/components/app-shell/app-icon";
import { Eyebrow, Panel } from "@/components/app-shell/dashboard-ui";

const areas = [
  ["Publication queue", "Review readiness, evidence and publication state.", "/admin/publication", "book"],
  ["Tools & calculators", "Manage calculator definitions, versions and datasets.", "/admin/tools", "calculator"],
  ["Content & resources", "Prepare guides, articles and educational resources.", "/admin/content", "bookmark"],
  ["Analytics", "Understand tool usage, acquisition and engagement.", "/admin/analytics", "chart"],
  ["SEO workspace", "Manage discoverability, structured content and search health.", "/admin/seo", "target"],
  ["Users & access", "Manage platform users, roles and access policies.", "/admin/users", "settings"],
] as const;

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <AdminShell userName={session.user.name} userEmail={session.user.email} active="Overview">
      <div className="space-y-8">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <Eyebrow><AppIcon name="sparkles" className="h-3.5 w-3.5" /> Platform operations</Eyebrow>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">Admin workspace</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">A unified control surface for publishing, content, tools, growth and platform operations.</p>
          </div>
          <Link href="/admin/publication" className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-[#151a12] px-5 text-xs font-bold text-white transition hover:bg-[#20251d] md:self-auto">
            Open publication queue <AppIcon name="arrow" className="h-4 w-4" />
          </Link>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {areas.map(([title, description, href, icon]) => (
            <Link key={title} href={href} className="group rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.035)] transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-600"><AppIcon name={icon} className="h-5 w-5" /></span>
              <h2 className="mt-5 text-base font-extrabold tracking-[-0.025em] text-slate-950">{title}</h2>
              <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-violet-600">Open workspace <AppIcon name="arrow" className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </div>

        <Panel title="Operations foundation" description="The admin surface is being connected module-by-module without fabricating operational data.">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Editorial workflow", "Active", "Publication controls and review evidence"],
              ["Access boundaries", "Protected", "Server-owned authentication and permissions"],
              ["Platform modules", "Expanding", "Content, analytics, SEO and monetization"],
            ].map(([title, status, note]) => (
              <div key={title} className="rounded-2xl bg-[#f7f7fb] p-4">
                <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold text-slate-900">{title}</p><span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-violet-700">{status}</span></div>
                <p className="mt-3 text-[11px] leading-5 text-slate-500">{note}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AdminShell>
  );
}
