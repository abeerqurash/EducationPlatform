"use client";

import type { FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { deleteManualStudySessionAction } from "@/app/actions/student-intelligence";

function DeleteButton({ title }: { title: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      aria-label={`Delete manually recorded session: ${title}`}
      className="text-xs font-semibold text-rose-700 underline underline-offset-2 hover:text-rose-900 disabled:opacity-50">
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

/** Confirmation runs before a server action; cancelling never sends a request. */
export function ConfirmStudySessionDelete({ activityId, title }: { activityId: string; title: string }) {
  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete the recorded study session “${title}”? This cannot be undone.`)) {
      event.preventDefault();
    }
  }
  return (
    <form action={deleteManualStudySessionAction} onSubmit={confirmDelete}>
      <input type="hidden" name="activityId" value={activityId} />
      <DeleteButton title={title} />
    </form>
  );
}
