import { WEEK_DAYS, type WeeklyStudySchedule } from "./study-weekly-schedule";

function csvCell(value: string | number): string {
  const safe = String(value).replace(/^[\t\r\n ]*[=+@-]/, value => `'${value}`);
  return `"${safe.replace(/"/g, '""')}"`;
}

export function formatWeeklyScheduleCsv(schedule: WeeklyStudySchedule): string {
  const rows = [["Weekday", "Planned minutes", "Suggested action", "Status"], ...schedule.entries.map(entry => [entry.day, entry.minutes, entry.action, "Planned, not completed"] as (string | number)[])];
  return "\uFEFF" + rows.map(row => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

export function nextMondayUtc(reference: Date): Date {
  if (!Number.isFinite(reference.getTime())) throw new Error("Invalid reference date");
  const monday = utcDate(reference.getUTCFullYear(), reference.getUTCMonth(), reference.getUTCDate());
  const daysAhead = (8 - monday.getUTCDay()) % 7 || 7;
  monday.setUTCDate(monday.getUTCDate() + daysAhead);
  return monday;
}

function stamp(date: Date): string {
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}T${String(date.getUTCHours()).padStart(2, "0")}${String(date.getUTCMinutes()).padStart(2, "0")}00Z`;
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

function foldLine(line: string): string {
  const chunks: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const count = new TextEncoder().encode(char).length;
    if (bytes + count > 75) { chunks.push(current); current = " "; bytes = 1; }
    current += char;
    bytes += count;
  }
  chunks.push(current);
  return chunks.join("\r\n");
}

/** Calendar import creates a one-week, non-recurring plan in UTC; it never logs activity. */
export function formatWeeklyScheduleIcs(schedule: WeeklyStudySchedule, reference: Date, startHourUtc = 9): string {
  if (!Number.isInteger(startHourUtc) || startHourUtc < 0 || startHourUtc > 23) throw new Error("Invalid UTC start hour");
  const monday = nextMondayUtc(reference);
  const created = stamp(reference);
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//EducationPlatform//Study Plan//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Planned study schedule"];
  for (const entry of schedule.entries) {
    const index = WEEK_DAYS.indexOf(entry.day);
    if (index < 0) continue;
    const start = new Date(monday.getTime());
    start.setUTCDate(start.getUTCDate() + index);
    start.setUTCHours(startHourUtc);
    const end = new Date(start.getTime() + entry.minutes * 60_000);
    const uid = `study-plan-${stamp(start)}-${index}@educationplatform.local`;
    lines.push("BEGIN:VEVENT", `UID:${uid}`, `DTSTAMP:${created}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${escapeIcs("Planned study session")}`, `DESCRIPTION:${escapeIcs(`${entry.action}\nPlanned only; not completed or logged.`)}`, "STATUS:TENTATIVE", "TRANSP:OPAQUE", "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
