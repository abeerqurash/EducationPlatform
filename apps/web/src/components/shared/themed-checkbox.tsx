"use client";

import type { ReactNode } from "react";

/** Accessible native checkbox with a consistent, custom dashboard presentation. */
export function ThemedCheckbox({ label, checked, disabled, onChange, ariaLabel }: {
  label: ReactNode;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
}) {
  return <label className="group inline-flex min-h-10 cursor-pointer items-center gap-2.5 rounded-xl border border-[#dfe0d5] bg-white px-3 py-2 text-xs font-bold text-[#171912] shadow-sm transition-colors hover:border-[#a4aa94] hover:bg-[#f7f8f2] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#171912] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45">
    <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} aria-label={ariaLabel} onChange={event => onChange(event.target.checked)} />
    <span aria-hidden="true" className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 border-[#a4aa94] bg-white text-transparent transition-colors peer-checked:border-[#171912] peer-checked:bg-[#171912] peer-checked:text-white"><svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 3.2 3.2L13 4.5" /></svg></span>
    <span>{label}</span>
  </label>;
}
