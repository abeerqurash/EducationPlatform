"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  deleteStudentResult,
} from "@/app/actions/student-results";

export function DeleteSavedResultButton({
  resultId,
}: {
  resultId: string;
}) {
  const [confirming, setConfirming] =
    useState(false);
  const [pending, startTransition] =
    useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        className="self-start rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-950 sm:self-auto"
        onClick={() => setConfirming(true)}
      >
        Remove
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        className="rounded-full bg-[#151a12] px-3.5 py-2 text-xs font-bold text-white disabled:opacity-50"
        onClick={() =>
          startTransition(async () => {
            await deleteStudentResult(resultId);
          })
        }
      >
        {pending ? "Removing..." : "Confirm"}
      </button>
      <button
        type="button"
        disabled={pending}
        className="rounded-full px-3 py-2 text-xs font-bold text-slate-500"
        onClick={() => setConfirming(false)}
      >
        Cancel
      </button>
    </div>
  );
}
