"use client";

import { useTransition } from "react";
import {
  archiveStudyGoalAction,
  toggleStudyGoalAction,
} from "@/app/actions/student-intelligence";

export function StudyGoalControls({
  goalId,
  completed,
}: {
  goalId: string;
  completed: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        className="rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50"
        onClick={() =>
          startTransition(async () => {
            await toggleStudyGoalAction(goalId, !completed);
          })
        }
      >
        {completed ? "Mark active" : "Complete"}
      </button>
      <button
        type="button"
        disabled={pending}
        className="rounded-full px-3 py-2 text-xs font-bold text-slate-500 disabled:opacity-50"
        onClick={() =>
          startTransition(async () => {
            await archiveStudyGoalAction(goalId);
          })
        }
      >
        Archive
      </button>
    </div>
  );
}
