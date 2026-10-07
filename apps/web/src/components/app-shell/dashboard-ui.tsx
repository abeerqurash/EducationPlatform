import Link from "next/link";
import type { ReactNode } from "react";
import { AppIcon } from "./app-icon";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-violet-600">{children}</span>;
}

export function MetricCard({ label, value, note, icon }: { label: string; value: string; note: string; icon: Parameters<typeof AppIcon>[0]["name"] }) {
  return (
    <article className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-slate-950">{value}</p></div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600"><AppIcon name={icon} className="h-[18px] w-[18px]" /></span>
      </div>
      <p className="mt-4 text-[11px] font-medium text-slate-400">{note}</p>
    </article>
  );
}

export function Panel({ title, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.035)] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><h2 className="text-base font-extrabold tracking-[-0.025em] text-slate-950">{title}</h2>{description ? <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p> : null}</div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function QuickTool({ title, description, href, icon }: { title: string; description: string; href: string; icon: Parameters<typeof AppIcon>[0]["name"] }) {
  return (
    <Link href={href} className="group flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-violet-200 hover:bg-violet-50/50">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-50 text-slate-600 transition group-hover:bg-white group-hover:text-violet-600"><AppIcon name={icon} className="h-5 w-5" /></span>
      <span className="min-w-0"><span className="block text-sm font-bold text-slate-900">{title}</span><span className="mt-1 block truncate text-[11px] text-slate-500">{description}</span></span>
      <AppIcon name="arrow" className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-600" />
    </Link>
  );
}
