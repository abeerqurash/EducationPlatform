import Link from "next/link";
import type { ReactNode } from "react";

/** Consistent, keyboard-accessible panel header navigation action. */
export function PanelActionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-2 rounded-full border border-[#c9ccc0] bg-white px-4 py-2 text-xs font-extrabold text-[#171912] no-underline shadow-sm transition-[background-color,border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#5d7d20] hover:bg-[#f7f8f2] hover:shadow-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#5d7d20] active:translate-y-0 motion-reduce:transform-none"
    >
      {children}
    </Link>
  );
}
