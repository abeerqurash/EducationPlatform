import type { StudyGoalExportRow } from "./export-format";

export type GoalExportStatus = "all" | "active" | "completed" | "archived";

/** Unknown query values fall back to the complete bounded export. */
export function parseGoalExportStatus(value: string | null): GoalExportStatus {
  return value === "active" || value === "completed" || value === "archived" ? value : "all";
}

/** Apply the same status rules across CSV, JSON and text exports. */
export function filterStudyGoalExport(rows: StudyGoalExportRow[], status: GoalExportStatus): StudyGoalExportRow[] {
  if (status === "all") return rows;
  return rows.filter((goal) => {
    if (status === "archived") return goal.isArchived;
    if (goal.isArchived) return false;
    return status === "completed" ? Boolean(goal.completedAt) : !goal.completedAt;
  });
}
