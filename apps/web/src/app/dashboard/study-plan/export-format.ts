/** Export only display-safe study-goal fields. No user IDs or internal record IDs. */
export type StudyGoalExportRow = {
  title: string;
  description: string | null;
  targetDate: string | null;
  targetMinutes: number | null;
  completedAt: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function studyGoalExportRecords(rows: StudyGoalExportRow[]) {
  return rows.map((goal) => ({
    title: goal.title,
    description: goal.description ?? "",
    status: goal.isArchived ? "Archived" : goal.completedAt ? "Completed" : "Active",
    targetDate: goal.targetDate ?? "",
    targetMinutes: goal.targetMinutes,
    completedAt: goal.completedAt ?? "",
    createdAtUtc: goal.createdAt.toISOString(),
    updatedAtUtc: goal.updatedAt.toISOString(),
  }));
}

/** Quote CSV values and neutralize spreadsheet formula execution. */
export function safeStudyGoalCsvCell(value: string | number | null): string {
  let text = value === null ? "" : String(value);
  if (/^[\s\u0000-\u001f]*[=+@-]/u.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function formatStudyGoalsCsv(rows: StudyGoalExportRow[]): string {
  const columns = ["Title", "Description", "Status", "Target date", "Target minutes", "Completed at", "Created at UTC", "Updated at UTC"];
  const data = studyGoalExportRecords(rows);
  const records = data.map((r) => [r.title, r.description, r.status, r.targetDate, r.targetMinutes, r.completedAt, r.createdAtUtc, r.updatedAtUtc]);
  return "\uFEFF" + [columns.map(safeStudyGoalCsvCell).join(","), ...records.map((row) => row.map(safeStudyGoalCsvCell).join(","))].join("\r\n") + "\r\n";
}

export function formatStudyGoalsJson(rows: StudyGoalExportRow[]): string {
  return JSON.stringify({ schemaVersion: 1, exportType: "study-goals", exportedCount: rows.length, limit: 1000, goals: studyGoalExportRecords(rows) }, null, 2) + "\n";
}
