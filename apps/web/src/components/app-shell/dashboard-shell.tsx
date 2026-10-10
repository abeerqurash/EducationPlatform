import Link from "next/link";
import type { ReactNode } from "react";
import { AppIcon } from "./app-icon";
import { AppLogo } from "./app-logo";
import { SiteButton } from "./site-button";

type NavItem = { label: string; href: string; icon: Parameters<typeof AppIcon>[0]["name"]; badge?: string };
type DashboardShellProps = { children: ReactNode; userName?: string | null; userEmail?: string | null; active?: string };

const nav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "home" },
  { label: "My tools", href: "/dashboard/tools", icon: "calculator" },
  { label: "Test prep", href: "/dashboard/test-prep", icon: "target" },
  { label: "Study plan", href: "/dashboard/study-plan", icon: "book" },
  { label: "Progress", href: "/dashboard/progress", icon: "chart" },
  { label: "Saved results", href: "/dashboard/saved", icon: "bookmark" },
  { label: "Workspaces", href: "/dashboard/workspaces", icon: "book" },
];

export function DashboardShell({ children, userName, userEmail, active = "Overview" }: DashboardShellProps) {
  const initials = (userName || userEmail || "Student").trim().slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f7fb] text-slate-950">
      <a href="#dashboard-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-slate-950 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] border-r border-slate-200/80 bg-white px-5 py-6 lg:flex lg:flex-col">
        <div className="px-2"><AppLogo /></div>
        <nav aria-label="Student dashboard" className="mt-9 space-y-1.5">
          {nav.map((item) => {
            const selected = item.label === active;
            return (
              <Link key={item.label} href={item.href} aria-current={selected ? "page" : undefined}
                className={`group flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition ${selected ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}>
                <AppIcon name={item.icon} className={`h-[19px] w-[19px] ${selected ? "text-violet-600" : "text-slate-400 group-hover:text-slate-700"}`} />
                <span>{item.label}</span>{item.badge ? <span className="ml-auto rounded-full bg-violet-100 px-2 py-0.5 text-[10px] text-violet-700">{item.badge}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="mb-5 rounded-2xl bg-slate-950 p-4 text-white">
            <div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-white/10"><AppIcon name="sparkles" className="h-4 w-4" /></div>
            <p className="text-sm font-bold">Unlock your full study plan</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">Advanced reports, unlimited saves and smarter recommendations.</p>
            <Link href="/pricing" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-violet-300">Explore Pro <AppIcon name="arrow" className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="space-y-1">
            <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"><AppIcon name="settings" className="h-[18px] w-[18px] text-slate-400" />Settings</Link>
            <Link href="/help" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"><AppIcon name="help" className="h-[18px] w-[18px] text-slate-400" />Help & support</Link>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[#f7f7fb]/90 backdrop-blur-xl">
          <div className="flex h-[76px] items-center gap-3 px-4 sm:px-6 lg:px-8 xl:px-10">
            <div className="lg:hidden"><AppLogo compact /></div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <SiteButton href="/tools" variant="secondary" size="small" className="hidden sm:inline-flex">Browse tools</SiteButton>
              <button type="button" aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-slate-950"><AppIcon name="bell" className="h-[18px] w-[18px]" /></button>
              <div className="ml-1 flex items-center gap-2.5 border-l border-slate-200 pl-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-sm font-extrabold text-violet-700">{initials}</span>
                <span className="hidden max-w-40 sm:block">
                  <span className="block truncate text-xs font-bold text-slate-900">{userName || "Student"}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-500">{userEmail || "Student account"}</span>
                </span>
              </div>
            </div>
          </div>
        </header>
        <nav aria-label="Mobile student dashboard" className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
          {nav.map((item) => {
            const selected = item.label === active;
            return (
              <Link key={item.label} href={item.href} aria-current={selected ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold ${selected ? "bg-[#151a12] text-white" : "bg-slate-50 text-slate-600"}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <main id="dashboard-main" className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9 xl:px-10">{children}</main>
      </div>
    </div>
  );
}
