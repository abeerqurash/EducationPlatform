"use client";
import Link from "next/link";
import { dashboardAction } from "@/components/shared/dashboard-action-styles";
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <section role="alert" className="mx-auto max-w-5xl space-y-4 rounded-2xl border border-[#dfe0d5] bg-white p-6"><h1 className="text-xl font-extrabold">Question library unavailable</h1><p className="text-sm leading-6">Try again, or continue with the practice lab while the library is unavailable.</p><div className="flex flex-wrap gap-2"><button type="button" onClick={retry} className={dashboardAction}>Try again</button><Link href="/dashboard/test-prep/practice/lab" className={dashboardAction}>Practice lab</Link></div></section>;
}
