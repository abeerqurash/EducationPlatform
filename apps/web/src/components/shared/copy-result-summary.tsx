"use client";

import { useEffect, useRef, useState } from "react";

type CopyKind = "summary" | "details";
type CopyStatus = "idle" | "summary" | "details" | "error";

/** Format already-authorized, displayed fields; never request additional private data. */
export function formatSavedResultDetails(input: {
  toolName: string;
  summary: string;
  savedDateUtc: string;
  calculatorVersion?: string | null;
}): string {
  return [
    input.toolName,
    input.summary,
    `Saved: ${input.savedDateUtc} UTC`,
    ...(input.calculatorVersion ? [`Calculator version: ${input.calculatorVersion}`] : []),
  ].join("\n");
}

/** Copies an existing saved summary or its displayed details without modifying the result. */
export function CopyResultSummary({ summary, details }: {
  summary: string;
  details?: { toolName: string; savedDateUtc: string; calculatorVersion?: string | null };
}) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const copy = async (kind: CopyKind) => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      if (kind === "summary") {
        await navigator.clipboard.writeText(summary);
      } else if (details) {
        await navigator.clipboard.writeText(formatSavedResultDetails({ ...details, summary }));
      } else {
        return;
      }
      setStatus(kind);
      resetTimer.current = setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      resetTimer.current = setTimeout(() => setStatus("idle"), 3500);
    }
  };

  const buttonClass = "inline-flex min-h-9 items-center justify-center rounded-full border border-[#dfe0d5] bg-white px-3 text-[11px] font-bold text-[#171912] transition hover:border-[#171912] hover:bg-[#f7f8f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912]";

  return (
    <div className="flex max-w-full flex-wrap items-center gap-2 sm:justify-end">
      <button type="button" onClick={() => void copy("summary")}
        aria-label="Copy saved result summary" className={buttonClass}>
        {status === "summary" ? "Copied" : "Copy summary"}
      </button>
      {details ? (
        <button type="button" onClick={() => void copy("details")}
          aria-label="Copy saved result details" className={buttonClass}>
          {status === "details" ? "Copied" : "Copy details"}
        </button>
      ) : null}
      <span role="status" aria-live="polite" className="text-[11px] text-slate-600">
        {status === "error" ? "Clipboard unavailable; select the text to copy." : status === "summary" ? "Summary copied" : status === "details" ? "Result details copied" : ""}
      </span>
    </div>
  );
}
