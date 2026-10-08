"use client";

import { deleteManualStudySessionAction } from "@/app/actions/student-intelligence";
import { ThemedConfirmDialog } from "@/components/shared/themed-confirm-dialog";

/** Confirm before invoking the owner-scoped server action; cancellation never submits. */
export function ConfirmStudySessionDelete({ activityId, title }: { activityId: string; title: string }) {
  return <ThemedConfirmDialog title="Delete study session?" description={`Delete “${title}”? This cannot be undone.`} trigger="Delete" confirmLabel="Delete session" action={deleteManualStudySessionAction} fields={{activityId}} />;
}
