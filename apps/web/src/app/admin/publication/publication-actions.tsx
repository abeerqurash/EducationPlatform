"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  runPublicationAction,
  type PublicationActionResponse,
} from "./actions";

type PublicationActionsProps = {
  toolId: string;
  toolName: string;
  status: string;
  canSubmit: boolean;
  canPublish: boolean;
};

function resultMessage(
  result: PublicationActionResponse,
) {
  if (result.ok) {
    return `Updated from ${result.fromStatus} to ${result.toStatus}.`;
  }

  if (
    result.code ===
    "state_conflict"
  ) {
    return "The publication state changed before this action completed. Refresh the page and review the latest state before trying again.";
  }

  if (
    result.code ===
    "not_found"
  ) {
    return "This publication target is no longer available. Refresh the publication queue before continuing.";
  }

  return result.message;
}

function issueMessages(
  result: PublicationActionResponse,
): string[] {
  if (
    result.ok ||
    result.code !==
      "transition_blocked" ||
    !Array.isArray(
      result.issues,
    )
  ) {
    return [];
  }

  return result.issues
    .map((issue) => {
      if (
        typeof issue ===
        "string"
      ) {
        return issue.trim();
      }

      if (
        issue &&
        typeof issue ===
          "object" &&
        "message" in issue &&
        typeof issue.message ===
          "string"
      ) {
        return issue.message.trim();
      }

      return "";
    })
    .filter(
      (message) =>
        message.length > 0,
    );
}

export function PublicationActions({
  toolId,
  toolName,
  status,
  canSubmit,
  canPublish,
}: PublicationActionsProps) {
  const router = useRouter();

  const [
    pending,
    startTransition,
  ] = useTransition();

  const [
    message,
    setMessage,
  ] = useState<string | null>(
    null,
  );

  const [
    isError,
    setIsError,
  ] = useState(false);

  const [
    blockers,
    setBlockers,
  ] = useState<string[]>([]);

  const [
    confirmPublish,
    setConfirmPublish,
  ] = useState(false);

  const [
    confirmSubmit,
    setConfirmSubmit,
  ] = useState(false);

  const [
    reason,
    setReason,
  ] = useState("");

  const [
    pendingAction,
    setPendingAction,
  ] = useState<
    | "submit_for_review"
    | "publish"
    | null
  >(null);

  const submitAllowed =
    canSubmit &&
    status !== "published" &&
    status !== "archived" &&
    status !== "review";

  const publishAllowed =
    canPublish &&
    status === "review";

  const reasonCharactersRemaining =
    1000 - reason.length;

  const normalizedReason =
    reason.trim();

  const confirmationOpen =
    confirmSubmit ||
    confirmPublish;

  const actionControlsLocked =
    pending ||
    confirmationOpen;

  function execute(
    action:
      | "submit_for_review"
      | "publish",
  ) {
    if (pending) {
      return;
    }

    setMessage(null);
    setIsError(false);
    setBlockers([]);
    setConfirmPublish(false);
    setConfirmSubmit(false);
    setPendingAction(action);

    startTransition(
      async () => {
        try {
          const result =
            await runPublicationAction({
              toolId,
              action,
              ...(normalizedReason
                ? {
                    reason:
                      normalizedReason,
                  }
                : {}),
            });

          setMessage(
            resultMessage(result),
          );

          setIsError(
            !result.ok,
          );

          setBlockers(
            issueMessages(result),
          );

          if (result.ok) {
            setReason("");
            router.refresh();
          } else if (
            result.code ===
              "state_conflict" ||
            result.code ===
              "not_found" ||
            result.code ===
              "transition_blocked"
          ) {
            setConfirmSubmit(false);
            setConfirmPublish(false);
            router.refresh();
          }
        } catch {
          setMessage(
            "The publication request could not be completed. Please try again.",
          );
          setIsError(true);
          setBlockers([]);
        } finally {
          setPendingAction(null);
        }
      },
    );
  }

  if (
    !submitAllowed &&
    !publishAllowed
  ) {
    return (
      <span className="text-xs text-slate-400">
        No action available
      </span>
    );
  }

  return (
    <div
      className="min-w-44"
      aria-busy={pending}
    >
      <label
        htmlFor={`publication-reason-${toolId}`}
        className="mb-3 block"
      >
        <span className="mb-1 block text-xs font-semibold text-slate-600">
          Action reason
          <span className="ml-1 font-normal text-slate-400">
            (optional)
          </span>
        </span>
        <textarea
          id={`publication-reason-${toolId}`}
          value={reason}
          maxLength={1000}
          aria-describedby={`publication-reason-count-${toolId}`}
          rows={2}
          disabled={
            pending ||
            confirmationOpen
          }
          onChange={(event) =>
            setReason(
              event.target.value,
            )
          }
          placeholder="Add context for the audit trail"
          className="w-full min-w-64 resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70"
        />
        <span
          id={`publication-reason-count-${toolId}`}
          aria-live="polite"
          className="mt-1 block text-right text-[11px] text-slate-400"
        >
          {reasonCharactersRemaining} characters remaining
        </span>

        {confirmationOpen ? (
          <span className="mt-1 block text-[11px] text-slate-500">
            Cancel the confirmation to edit the reason.
          </span>
        ) : null}
      </label>

      <div className="flex flex-wrap gap-2">
        {submitAllowed &&
        !confirmSubmit ? (
          <button
            type="button"
            disabled={actionControlsLocked}
            aria-disabled={actionControlsLocked}
            onClick={() => {
              setMessage(null);
              setIsError(false);
              setBlockers([]);
              setConfirmSubmit(true);
            }}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit for review
          </button>
        ) : null}

        {submitAllowed &&
        confirmSubmit ? (
          <div
            role="group"
            aria-label={`Confirm review submission of ${toolName}`}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 p-2"
          >
            <div className="px-1">
              <span className="block text-xs font-medium text-indigo-900">
                Move this tool to review?
              </span>
              <span className="mt-1 block max-w-xl whitespace-pre-wrap break-words text-[11px] text-indigo-700">
                {normalizedReason
                  ? `Reason: ${normalizedReason}`
                  : "No action reason provided."}
              </span>
            </div>

            <button
              type="button"
              disabled={pending}
              aria-disabled={pending}
              onClick={() =>
                execute(
                  "submit_for_review",
                )
              }
              className="rounded-lg bg-indigo-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending &&
              pendingAction ===
                "submit_for_review"
                ? "Submitting…"
                : "Confirm submission"}
            </button>

            <button
              type="button"
              disabled={pending}
              aria-disabled={pending}
              onClick={() => {
                setConfirmSubmit(
                  false,
                );
                setMessage(null);
                setIsError(false);
                setBlockers([]);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        ) : null}

        {publishAllowed &&
        !confirmPublish ? (
          <button
            type="button"
            disabled={actionControlsLocked}
            aria-disabled={actionControlsLocked}
            onClick={() => {
              setMessage(null);
              setIsError(false);
              setBlockers([]);
              setConfirmPublish(true);
            }}
            className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Publish
          </button>
        ) : null}

        {publishAllowed &&
        confirmPublish ? (
          <div
            role="group"
            aria-label={`Confirm publication of ${toolName}`}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2"
          >
            <div className="px-1">
              <span className="block text-xs font-medium text-amber-900">
                Publish this tool now?
              </span>
              <span className="mt-1 block max-w-xl whitespace-pre-wrap break-words text-[11px] text-amber-800">
                {normalizedReason
                  ? `Reason: ${normalizedReason}`
                  : "No action reason provided."}
              </span>
            </div>

            <button
              type="button"
              disabled={pending}
              aria-disabled={pending}
              onClick={() =>
                execute("publish")
              }
              className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending &&
              pendingAction ===
                "publish"
                ? "Publishing…"
                : "Confirm publish"}
            </button>

            <button
              type="button"
              disabled={pending}
              aria-disabled={pending}
              onClick={() => {
                setConfirmPublish(
                  false,
                );
                setMessage(null);
                setIsError(false);
                setBlockers([]);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        ) : null}
      </div>

      {message ? (
        <div
          role={
            isError
              ? "alert"
              : "status"
          }
          aria-live={
            isError
              ? "assertive"
              : "polite"
          }
          aria-atomic="true"
          className={`mt-2 text-xs ${
            isError
              ? "text-rose-600"
              : "text-emerald-700"
          }`}
        >
          <p>{message}</p>

          {blockers.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5" aria-label="Publication blockers">
              {blockers.map(
                (blocker) => (
                  <li key={blocker}>
                    {blocker}
                  </li>
                ),
              )}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
