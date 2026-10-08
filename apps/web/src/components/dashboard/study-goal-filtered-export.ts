import type { FilterableGoal, GoalWorkspaceFilter } from "./study-goal-filter";

export type GoalExportFormat = "csv" | "json" | "txt";

/** Exports only the already account-scoped, filtered and sorted goals passed by the dashboard. */
export function formatFilteredGoals(goals: readonly FilterableGoal[], filter: GoalWorkspaceFilter, format: GoalExportFormat, generatedAt: string): string {
  const records = goals.map(goal => ({
    id: goal.id,
    title: goal.title,
    notes: goal.description ?? "",
    status: goal.completedAt ? "Completed" : "Open",
    targetDate: goal.targetDate ?? "",
    targetMinutes: goal.targetMinutes ?? "",
    completedAt: goal.completedAt instanceof Date ? goal.completedAt.toISOString() : goal.completedAt ?? "",
  }));
  if (format === "json") return JSON.stringify({ schemaVersion: 1, generatedAt, filters: filter, count: records.length, goals: records }, null, 2) + "\n";
  if (format === "txt") return ["STUDY GOALS — FILTERED VIEW", `Generated: ${generatedAt}`, `Matching goals: ${records.length}`, `Search: ${filter.query || "(none)"}`, `Status: ${filter.status}`, `Deadline: ${filter.deadline}`, `Sort: ${filter.sort}`, "", ...records.map((r, i) => `${i + 1}. ${r.title}\n   Status: ${r.status}\n   Deadline: ${r.targetDate || "None"}\n   Minutes: ${r.targetMinutes || "None"}\n   Notes: ${r.notes || "None"}`)].join("\n") + "\n";
  const quote = (value: unknown) => {
    let text = String(value ?? "");
    // Prevent spreadsheet formula injection when CSV files are opened in Excel or Sheets.
    if (/^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  const fields = ["id", "title", "notes", "status", "targetDate", "targetMinutes", "completedAt"] as const;
  return [fields.join(","), ...records.map(record => fields.map(field => quote(record[field])).join(","))].join("\r\n") + "\r\n";
}

export function filteredGoalFilename(format: GoalExportFormat, date: string): string {
  const safeDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "export";
  return `study-goals-filtered-${safeDate}.${format}`;
}
