import Link from "next/link";
import type { ReactNode } from "react";
import { AppIcon } from "./app-icon";
import { AppLogo } from "./app-logo";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f7f7fb] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(460px,.78fr)]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col xl:p-16">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10">
          <AppLogo />
        </div>
        <div className="relative z-10 my-auto max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-violet-200">
            <AppIcon name="sparkles" className="h-3.5 w-3.5" />
            Built for better outcomes
          </span>
          <h2 className="mt-6 text-4xl font-extrabold tracking-[-0.05em] xl:text-5xl">
            Your academic decisions, finally in one place.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">
            Accurate calculators, test-prep tools, saved results and progress insights designed to help students move with confidence.
          </p>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {[
              ["100+", "Study tools"],
              ["1", "Smart workspace"],
              ["24/7", "Available"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <strong className="block text-xl font-extrabold">{value}</strong>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-slate-500">Education+ · Learn smarter, plan better.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-[460px]">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <AppLogo />
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-violet-700">Back home</Link>
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-violet-600">{eyebrow}</span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-7 text-center text-xs text-slate-500">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}

export const authFieldClass =
  "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50";

export const authButtonClass =
  "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#20251d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60";
