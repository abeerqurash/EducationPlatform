"use client";
import Link from "next/link";
import { dashboardAction } from "@/components/shared/dashboard-action-styles";
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <main className="mx-auto max-w-3xl p-6">
    <section role="alert" className="rounded-[28px] border border-[#dfe0d5] bg-white p-6">
      <h1 className="text-xl font-extrabold text-[#171912]">Your report could not be loaded</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">Please try again. If this continues, return to practice history and check that saved sessions are available.</p>
      <div className="mt-5 flex flex-wrap gap-2"><button type="button" className={dashboardAction} onClick={retry}>Try again</button><Link href="/dashboard/test-prep/practice/history" className={dashboardAction}>Session history</Link></div>
    </section>
  </main>;
}
