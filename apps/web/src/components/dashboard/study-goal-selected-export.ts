import type { FilterableGoal, GoalWorkspaceFilter } from "./study-goal-filter";
import { formatFilteredGoals, type GoalExportFormat } from "./study-goal-filtered-export";

/** Keep the active filter order and never export a stale or unrelated selection. */
export function selectGoalsForExport<T extends FilterableGoal>(matching: readonly T[], selectedIds: readonly string[], limit = 50): T[] {
  const allowed = new Set(selectedIds.slice(0, Math.max(0, limit)));
  return matching.filter(goal => allowed.has(goal.id));
}

export function formatSelectedGoals(goals: readonly FilterableGoal[], filter: GoalWorkspaceFilter, format: GoalExportFormat, generatedAt: string): string {
  const output = formatFilteredGoals(goals, filter, format, generatedAt);
  if (format === "json") {
    const parsed = JSON.parse(output) as Record<string, unknown>;
    return JSON.stringify({ ...parsed, exportScope: "selected" }, null, 2) + "\n";
  }
  if (format === "txt") return output.replace("STUDY GOALS — FILTERED VIEW", "STUDY GOALS — SELECTED RECORDS");
  return output;
}

export function selectedGoalFilename(format: GoalExportFormat, date: string): string {
  const safeDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "export";
  return `study-goals-selected-${safeDate}.${format}`;
}
