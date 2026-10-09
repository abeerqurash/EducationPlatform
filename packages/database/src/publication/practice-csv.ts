import type { PracticeHistoryEntry } from "./practice-progress";
const quote = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
/** Safe CSV for spreadsheet viewers: prefix formula-like values before quoting. */
export function practiceHistoryCsv(entries: readonly PracticeHistoryEntry[]) {
  const safe = (value: string | number) => {
    const text = String(value);
    return quote(/^[\s]*[=+@-]/.test(text) ? `'${text}` : text);
  };
  const rows = entries.map(entry => [
    new Date(entry.createdAt).toISOString(), entry.exam, entry.total,
    entry.correct, entry.percentage, entry.durationSeconds,
  ].map(safe).join(","));
  return ["Date,Exam,Questions,Correct,Percentage,Duration seconds", ...rows].join("\r\n");
}
