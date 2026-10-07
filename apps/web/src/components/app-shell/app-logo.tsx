import Link from "next/link";

export function AppLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#151a12] text-[#c9ff36] shadow-sm">
        <span className="text-lg font-black tracking-[-0.08em]">E+</span>
      </span>
      {!compact ? (
        <span className="leading-none">
          <span className="block text-[15px] font-extrabold tracking-[-0.035em] text-slate-950">Education</span>
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Platform</span>
        </span>
      ) : null}
    </Link>
  );
}
