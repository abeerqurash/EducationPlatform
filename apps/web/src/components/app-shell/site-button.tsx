import Link from "next/link";
import type { ReactNode } from "react";

export function SiteButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-xs font-extrabold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c9ff36]/25";

  const appearance =
    variant === "primary"
      ? "bg-[#151a12] text-white hover:bg-[#252c21]"
      : "border border-[#dfe2dc] bg-white text-[#252c21] shadow-sm hover:border-[#bfc5ba] hover:bg-[#f8f8f5]";

  return (
    <Link
      href={href}
      className={`${base} ${appearance} ${className}`}
    >
      {children}
    </Link>
  );
}
