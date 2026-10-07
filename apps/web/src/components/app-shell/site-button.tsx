import Link from "next/link";
import type { ReactNode } from "react";

type SiteButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light" | "ghost-light";
  size?: "small" | "default" | "large";
  className?: string;
};

const base =
  "relative isolate inline-flex items-center justify-center gap-[9px] overflow-hidden rounded-full border border-transparent text-sm font-[750] cursor-pointer " +
  "translate-y-0 scale-100 transition-[transform,border-color,box-shadow,color,background-color] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "before:pointer-events-none before:absolute before:-left-[55%] before:-top-[60%] before:-z-[1] before:h-[220%] before:w-[42%] before:rotate-12 before:opacity-[.42] " +
  "before:bg-[linear-gradient(105deg,transparent_10%,rgba(255,255,255,.04)_25%,rgba(255,255,255,.65)_48%,rgba(255,255,255,.06)_70%,transparent_90%)] " +
  "before:animate-[button-shimmer_4.8s_cubic-bezier(.4,0,.2,1)_infinite] " +
  "after:absolute after:-bottom-[15px] after:left-1/2 after:-z-[2] after:h-[10px] after:w-[10px] after:-translate-x-1/2 after:scale-0 after:rounded-full " +
  "after:transition-transform after:duration-[600ms] after:ease-[cubic-bezier(.16,1,.3,1)] " +
  "hover:-translate-y-[3px] hover:scale-[1.018] hover:shadow-[0_13px_30px_rgba(23,25,18,.13)] hover:after:scale-[32] " +
  "active:translate-y-0 active:scale-[.965] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#5d7d20] focus-visible:outline-offset-4 " +
  "motion-reduce:transform-none motion-reduce:transition-none motion-reduce:before:animate-none";

const variants = {
  primary:
    "bg-[#171912] !text-white [&_*]:!text-white after:bg-[#30342a]",
  secondary:
    "border-[#c9ccc0] bg-transparent text-[#171912] after:bg-white before:opacity-[.22]",
  light:
    "bg-[#d8ff62] text-[#171912] after:bg-[#c9f24f] before:opacity-[.28]",
  "ghost-light":
    "border-white/30 bg-transparent !text-white [&_*]:!text-white after:bg-white/10",
} as const;

const sizes = {
  small: "min-h-[42px] px-[19px]",
  default: "min-h-[46px] px-[21px]",
  large: "min-h-[54px] px-[26px]",
} as const;

export function SiteButton({
  href,
  children,
  variant = "primary",
  size = "default",
  className = "",
}: SiteButtonProps) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
