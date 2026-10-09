import type { GoalInsightRecord } from "./goal-insights";

export type GoalPriority = "overdue" | "today" | "soon" | "later" | "unscheduled";
export type PrioritizedGoal = { id: string; title: string; targetDate: string | null; targetMinutes: number; priority: GoalPriority; daysUntilDue: number | null };
const DAY_MS = 86400000;
const validDate = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
const rank: Record<GoalPriority, number> = { overdue: 0, today: 1, soon: 2, later: 3, unscheduled: 4 };

/** Read-only prioritization of account-scoped goals; no persisted changes or inferred completion. */
export function prioritizeStudyGoals(goals: readonly GoalInsightRecord[], todayUtc: string, limit = 12): PrioritizedGoal[] {
  if (!validDate(todayUtc)) return [];
  const todayMs = Date.parse(`${todayUtc}T00:00:00Z`);
  return goals.filter(goal => !goal.completedAt).map(goal => {
    const targetDate = goal.targetDate && validDate(goal.targetDate) ? goal.targetDate : null;
    const daysUntilDue = targetDate ? Math.round((Date.parse(`${targetDate}T00:00:00Z`) - todayMs) / DAY_MS) : null;
    const priority: GoalPriority = daysUntilDue === null ? "unscheduled" : daysUntilDue < 0 ? "overdue" : daysUntilDue === 0 ? "today" : daysUntilDue <= 7 ? "soon" : "later";
    return { id: goal.id, title: goal.title, targetDate, targetMinutes: Number.isFinite(goal.targetMinutes) && (goal.targetMinutes ?? 0) > 0 ? Math.min(100000, Math.floor(goal.targetMinutes!)) : 0, daysUntilDue, priority };
  }).sort((a, b) => rank[a.priority] - rank[b.priority] || (a.daysUntilDue ?? Infinity) - (b.daysUntilDue ?? Infinity) || a.title.localeCompare(b.title) || a.id.localeCompare(b.id)).slice(0, Math.max(0, Math.min(100, Math.floor(Number.isFinite(limit) ? limit : 12))));
}

export function summarizePriorityQueue(goals: readonly PrioritizedGoal[]) {
  return { visible: goals.length, urgent: goals.filter(goal => goal.priority === "overdue" || goal.priority === "today").length, plannedMinutes: goals.reduce((sum, goal) => sum + goal.targetMinutes, 0), withoutDeadline: goals.filter(goal => goal.priority === "unscheduled").length };
}

export function formatPriorityQueueText(goals: readonly PrioritizedGoal[], todayUtc: string): string {
  return ["STUDY GOAL PRIORITY QUEUE", `Reference date (UTC): ${todayUtc}`, "", ...goals.map((goal, i) => `${i + 1}. ${goal.title.replace(/[\r\n]+/g, " ")} | ${goal.priority} | ${goal.targetDate ?? "No deadline"} | ${goal.targetMinutes} planned minutes`), ...(goals.length ? [] : ["No open goals to prioritize."]), "", "Planning guidance only; no goals have been changed.", ""].join("\n");
}
