import type { FilterableGoal } from "./study-goal-filter";

export type GoalWorkspaceInsights = {
  total: number;
  open: number;
  completed: number;
  completionRate: number;
  overdue: number;
  dueToday: number;
  dueNextSevenDays: number;
  unscheduled: number;
  plannedMinutes: number;
  completedMinutes: number;
  remainingMinutes: number;
  nextDeadline: string | null;
};

/** Aggregate only the goals matching the current workspace filters. Dates are UTC calendar days. */
export function summarizeWorkspaceGoals(goals: readonly FilterableGoal[], todayUtc: string): GoalWorkspaceInsights {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(todayUtc) || Number.isNaN(Date.parse(`${todayUtc}T00:00:00Z`))) {
    throw new Error("todayUtc must be a valid YYYY-MM-DD date");
  }
  const sevenDays = new Date(`${todayUtc}T00:00:00.000Z`);
  sevenDays.setUTCDate(sevenDays.getUTCDate() + 7);
  const cutoff = sevenDays.toISOString().slice(0, 10);
  let completed = 0;
  let overdue = 0;
  let dueToday = 0;
  let dueNextSevenDays = 0;
  let unscheduled = 0;
  let plannedMinutes = 0;
  let completedMinutes = 0;
  let nextDeadline: string | null = null;
  for (const goal of goals) {
    const minutes = Number.isFinite(goal.targetMinutes) && (goal.targetMinutes ?? 0) > 0 ? Math.floor(goal.targetMinutes!) : 0;
    plannedMinutes += minutes;
    if (goal.completedAt) {
      completed++;
      completedMinutes += minutes;
      continue;
    }
    if (!goal.targetDate) {
      unscheduled++;
      continue;
    }
    if (goal.targetDate < todayUtc) overdue++;
    else if (goal.targetDate === todayUtc) dueToday++;
    else if (goal.targetDate <= cutoff) dueNextSevenDays++;
    if (goal.targetDate >= todayUtc && (nextDeadline === null || goal.targetDate < nextDeadline)) nextDeadline = goal.targetDate;
  }
  return {
    total: goals.length,
    open: goals.length - completed,
    completed,
    completionRate: goals.length ? Math.round((completed / goals.length) * 100) : 0,
    overdue,
    dueToday,
    dueNextSevenDays,
    unscheduled,
    plannedMinutes,
    completedMinutes,
    remainingMinutes: plannedMinutes - completedMinutes,
    nextDeadline,
  };
}
