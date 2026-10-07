"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  saveStudentResult,
} from "@/app/actions/student-results";

type SaveResultButtonProps = {
  toolSlug: string;
  toolName: string;
  summary: string;
  inputSnapshot: Record<string, unknown>;
  resultSnapshot: Record<string, unknown>;
};

export function SaveResultButton({
  toolSlug,
  toolName,
  summary,
  inputSnapshot,
  resultSnapshot,
}: SaveResultButtonProps) {
  const [message, setMessage] =
    useState<string | null>(null);
  const [saved, setSaved] =
    useState(false);
  const [pending, startTransition] =
    useTransition();

  function save() {
    if (pending || saved) {
      return;
    }

    setMessage(null);

    startTransition(async () => {
      const response =
        await saveStudentResult({
          toolSlug,
          toolName,
          summary,
          inputSnapshot,
          resultSnapshot,
        });

      if (!response.ok) {
        setMessage(response.message);
        return;
      }

      setSaved(true);
      setMessage("Saved to your dashboard.");
    });
  }

  return (
    <div className="save-result-control">
      <button
        type="button"
        className="button button--secondary"
        disabled={pending || saved}
        onClick={save}
      >
        {pending
          ? "Saving..."
          : saved
            ? "Saved"
            : "Save result"}
      </button>

      {message ? (
        <p
          role="status"
          aria-live="polite"
          className="mt-2 text-xs"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
