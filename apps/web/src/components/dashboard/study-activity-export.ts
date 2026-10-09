import type { StudyActivityRow } from "./study-activity-filter";

/** Export only the bounded, account-scoped rows already provided by the server. */
export type StudyActivityExportFormat = "csv" | "json" | "txt";

function csvCell(value: string | number): string {
  const raw = String(value).replace(/\r\n?/g, "\n");
  // Neutralize spreadsheet formulas, including after leading whitespace/control chars.
  const safe = /^[\s\u0000-\u001f]*[=+@-]/u.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

function typeLabel(row: StudyActivityRow): string {
  return row.activityType === "study_session" ? "Study session" : "Calculator activity";
}

function utcDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Unknown" : parsed.toISOString();
}

export function formatStudyActivityExport(rows: readonly StudyActivityRow[], format: StudyActivityExportFormat): string {
  if (format === "json") return JSON.stringify({ version: 1, timezone: "UTC", count: rows.length, activities: rows.map(row => ({
    id: row.id, title: row.title, type: typeLabel(row), minutes: row.durationMinutes, recordedAt: utcDate(row.createdAt), manuallyLogged: row.manual,
  })) }, null, 2);
  if (format === "csv") return [
    ["ID", "Title", "Activity type", "Minutes", "Recorded at (UTC)", "Manually logged"].map(csvCell).join(","),
    ...rows.map(row => [row.id, row.title, typeLabel(row), row.durationMinutes, utcDate(row.createdAt), row.manual ? "Yes" : "No"].map(csvCell).join(",")),
  ].join("\r\n") + "\r\n";
  return ["STUDY ACTIVITY HISTORY", `Matching records: ${rows.length}`, "Times: UTC", "", ...rows.flatMap((row, index) => [
    `${index + 1}. ${row.title.replace(/[\r\n]+/g, " ")}`,
    `   ${typeLabel(row)} | ${row.durationMinutes} min | ${utcDate(row.createdAt)}${row.manual ? " | Manual" : ""}`,
  ])].join("\n") + "\n";
}

export function activityExportFilename(format: StudyActivityExportFormat): string {
  return `study-activity-filtered.${format}`;
}
