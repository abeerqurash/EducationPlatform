"use client";
import Link from "next/link";
import { dashboardAction } from "@/components/shared/dashboard-action-styles";
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <section role="alert" className="space-y-4 rounded-2xl border border-[#dfe0d5] bg-white p-6"><h1 className="text-xl font-extrabold">Editorial bank unavailable</h1><p className="text-sm leading-6">Check database connectivity, migration 0006 and the question-bank role seed, then try again.</p><div className="flex gap-2"><button type="button" onClick={retry} className={dashboardAction}>Try again</button><Link href="/admin" className={dashboardAction}>Admin overview</Link></div></section>;
}
