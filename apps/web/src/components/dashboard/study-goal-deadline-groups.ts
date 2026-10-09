import type { FilterableGoal } from "./study-goal-filter";

export type GoalDeadlineGroupKey = "overdue" | "today" | "soon" | "later" | "unscheduled" | "completed";
export type GoalDeadlineGroup<T> = { key: GoalDeadlineGroupKey; label: string; goals: T[]; minutes: number };

const GROUPS: { key: GoalDeadlineGroupKey; label: string }[] = [
  { key: "overdue", label: "Overdue" },
  { key: "today", label: "Due today" },
  { key: "soon", label: "Next seven days" },
  { key: "later", label: "Later deadlines" },
  { key: "unscheduled", label: "No deadline" },
  { key: "completed", label: "Completed" },
];

/** Group a page of goals by UTC deadline, without mutating the incoming ordering. */
export function groupGoalsByDeadline<T extends FilterableGoal>(goals: readonly T[], todayUtc: string): GoalDeadlineGroup<T>[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(todayUtc) || Number.isNaN(Date.parse(`${todayUtc}T00:00:00Z`))) {
    throw new Error("todayUtc must be a valid YYYY-MM-DD date");
  }
  const cutoff = new Date(`${todayUtc}T00:00:00.000Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() + 7);
  const lastSoonDay = cutoff.toISOString().slice(0, 10);
  const buckets = new Map<GoalDeadlineGroupKey, T[]>(GROUPS.map(({ key }) => [key, []]));
  for (const goal of goals) {
    let key: GoalDeadlineGroupKey;
    if (goal.completedAt) key = "completed";
    else if (!goal.targetDate) key = "unscheduled";
    else if (goal.targetDate < todayUtc) key = "overdue";
    else if (goal.targetDate === todayUtc) key = "today";
    else if (goal.targetDate <= lastSoonDay) key = "soon";
    else key = "later";
    buckets.get(key)!.push(goal);
  }
  return GROUPS.flatMap(({ key, label }) => {
    const members = buckets.get(key)!;
    return members.length ? [{ key, label, goals: members, minutes: members.reduce((total, goal) => total + (Number.isFinite(goal.targetMinutes) && (goal.targetMinutes ?? 0) > 0 ? Math.floor(goal.targetMinutes!) : 0), 0) }] : [];
  });
}
