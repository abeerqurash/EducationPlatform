"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePracticeAttemptAction } from "@/app/actions/practice-attempts";
export function PracticeAttemptDelete({ attemptId }: { attemptId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <div className="space-y-2"><button type="button" disabled={busy} onClick={async () => {
    if (!window.confirm("Permanently delete this practice session? This cannot be undone.")) return;
    setBusy(true); setError("");
    try { const result = await deletePracticeAttemptAction(attemptId); if (!result.ok) throw new Error("Delete unsuccessful"); router.push("/dashboard/test-prep/practice/history"); router.refresh(); }
    catch { setError("Unable to delete the session. Please try again."); setBusy(false); }
  }} className="inline-flex min-h-11 items-center rounded-full border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50">{busy ? "Deleting…" : "Delete saved session"}</button>{error && <p role="alert" className="text-sm text-rose-700">{error}</p>}</div>;
}
