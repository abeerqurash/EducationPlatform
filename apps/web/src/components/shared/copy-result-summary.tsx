"use client";

import { useEffect, useRef, useState } from "react";

/** Copies the exact saved summary without modifying the stored calculation. */
export function CopyResultSummary({ summary }: { summary: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const copy = async () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(summary);
      setStatus("copied");
      resetTimer.current = setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      resetTimer.current = setTimeout(() => setStatus("idle"), 3500);
    }
  };

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
      <button type="button" onClick={copy}
        aria-label="Copy saved result summary"
        className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#dfe0d5] bg-white px-3 text-[11px] font-bold text-[#171912] transition hover:border-[#171912] hover:bg-[#f7f8f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912]">
        {status === "copied" ? "Copied" : "Copy summary"}
      </button>
      <span role="status" aria-live="polite" className="text-[11px] text-slate-600">
        {status === "error" ? "Clipboard unavailable; select the text to copy." : status === "copied" ? "Summary copied" : ""}
      </span>
    </div>
  );
}
