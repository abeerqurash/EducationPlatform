import Link from "next/link";
import type { ReactNode } from "react";
import { AppIcon } from "./app-icon";
import { AppLogo } from "./app-logo";
import { SiteButton } from "./site-button";

const sections = [
  {
    label: "Workspace",
    items: [
      ["Overview", "/admin", "home"],
      ["Publication", "/admin/publication", "book"],
      ["Tools & calculators", "/admin/tools", "calculator"],
      ["Content", "/admin/content", "bookmark"],
    ],
  },
  {
    label: "Growth",
    items: [
      ["Analytics", "/admin/analytics", "chart"],
      ["SEO", "/admin/seo", "target"],
      ["Monetization", "/admin/monetization", "sparkles"],
    ],
  },
  {
    label: "Platform",
    items: [
      ["Users & access", "/admin/users", "settings"],
      ["Support", "/admin/support", "help"],
      ["Settings", "/admin/settings", "settings"],
    ],
  },
] as const;

export function AdminShell({
  children,
  active = "Overview",
  userName,
  userEmail,
}: {
  children: ReactNode;
  active?: string;
  userName?: string | null;
  userEmail?: string | null;
}) {
  const initials = (userName || userEmail || "Admin").trim().slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-slate-950 focus:px-4 focus:py-2 focus:text-white">
        Skip to admin content
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] border-r border-slate-200/80 bg-white px-5 py-6 lg:flex lg:flex-col">
        <div className="flex items-center justify-between px-2">
          <AppLogo />
          <span className="rounded-lg bg-violet-50 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-violet-700">Admin</span>
        </div>

        <div className="mt-8 flex-1 overflow-y-auto pr-1">
          {sections.map((section) => (
            <div key={section.label} className="mb-7">
              <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">{section.label}</p>
              <nav aria-label={`${section.label} admin navigation`} className="space-y-1">
                {section.items.map(([label, href, icon]) => {
                  const selected = label === active;
                  return (
                    <Link key={label} href={href} aria-current={selected ? "page" : undefined}
                      className={`group flex min-h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold transition ${selected ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}>
                      <AppIcon name={icon} className={`h-[17px] w-[17px] ${selected ? "text-violet-600" : "text-slate-400 group-hover:text-slate-700"}`} />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-4">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-950">
            <AppIcon name="arrow" className="h-4 w-4 rotate-180" /> View public site
          </Link>
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[#f6f7fb]/90 backdrop-blur-xl">
          <div className="flex h-[76px] items-center gap-3 px-4 sm:px-6 lg:px-8 xl:px-10">
            <div className="lg:hidden"><AppLogo compact /></div>
            <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-400 shadow-sm md:flex">
              <AppIcon name="search" className="h-4 w-4" />
              Search admin workspace
            </div>
            <div className="ml-auto flex items-center gap-2.5">
              <SiteButton href="/admin/publication" variant="secondary" size="small" className="hidden sm:inline-flex">
                Publication queue
              </SiteButton>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#151a12] text-sm font-extrabold text-white">{initials}</span>
              <span className="hidden sm:block">
                <span className="block max-w-36 truncate text-xs font-bold text-slate-900">{userName || "Administrator"}</span>
                <span className="mt-0.5 block max-w-36 truncate text-[10px] text-slate-500">{userEmail || "Admin workspace"}</span>
              </span>
            </div>
          </div>
        </header>
        <nav aria-label="Mobile admin navigation" className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
          {sections.map((section) =>
            section.items.map(([label, href]) => {
              const selected = label === active;

              return (
                <Link
                  key={label}
                  href={href}
                  aria-current={selected ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold ${
                    selected
                      ? "bg-[#151a12] text-white"
                      : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {label}
                </Link>
              );
            }),
          )}
        </nav>
        <main id="admin-main" className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9 xl:px-10">{children}</main>
      </div>
    </div>
  );
}
