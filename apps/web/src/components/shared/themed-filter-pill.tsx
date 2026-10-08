import Link from "next/link";
import type { ReactNode } from "react";

/** Shared dashboard navigation filter, aligned with the public catalog's pill treatment. */
export function ThemedFilterPill({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return <Link href={href} aria-current={active ? "page" : undefined}
    className={`inline-flex min-h-10 items-center justify-center rounded-full border px-5 py-2.5 text-xs font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912] ${active ? "border-[#171912] bg-[#171912] !text-white" : "border-[#dfe0d5] bg-[#fafaf7] text-[#171912] hover:border-[#171912]"}`}>
    {children}
  </Link>;
}
