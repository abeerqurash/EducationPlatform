import { WEEK_DAYS, type WeekDay, type WeeklyStudySchedule } from "./study-weekly-schedule";

export type StudySchedulePresetId = "weekdays" | "balanced" | "weekend" | "daily" | "intensive";
export type StudySchedulePreset = { id: StudySchedulePresetId; title: string; description: string; days: readonly WeekDay[]; minutes: number; overrides: Partial<Record<WeekDay, number>> };

export const STUDY_SCHEDULE_PRESETS: readonly StudySchedulePreset[] = [
  { id: "weekdays", title: "Weekday routine", description: "30 minutes each weekday", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], minutes: 30, overrides: {} },
  { id: "balanced", title: "Balanced week", description: "Three focused 45-minute sessions", days: ["Monday", "Wednesday", "Friday"], minutes: 45, overrides: {} },
  { id: "weekend", title: "Weekend focus", description: "Two 90-minute sessions", days: ["Saturday", "Sunday"], minutes: 90, overrides: {} },
  { id: "daily", title: "Daily habit", description: "15 minutes every day", days: WEEK_DAYS, minutes: 15, overrides: {} },
  { id: "intensive", title: "Intensive plan", description: "Four longer sessions with a weekend review", days: ["Monday", "Tuesday", "Thursday", "Saturday"], minutes: 60, overrides: { Saturday: 90 } },
];

export function findStudySchedulePreset(id: string): StudySchedulePreset | undefined {
  return STUDY_SCHEDULE_PRESETS.find(preset => preset.id === id);
}

function htmlEscape(value: string | number): string {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Standalone, self-contained printable HTML; all dynamic text is escaped. */
export function formatWeeklySchedulePrintableHtml(schedule: WeeklyStudySchedule): string {
  const rows = schedule.entries.map(entry => `<tr><th scope="row">${htmlEscape(entry.day)}</th><td>${htmlEscape(entry.minutes)} min</td><td>${htmlEscape(entry.action)}</td><td>Planned</td></tr>`).join("\n");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Weekly Study Planner</title><style>body{font:16px system-ui,sans-serif;max-width:900px;margin:32px auto;padding:0 20px;color:#172033}h1{font-size:30px}p{line-height:1.6}table{width:100%;border-collapse:collapse;margin:24px 0}th,td{text-align:left;border-bottom:1px solid #d7dce6;padding:14px 10px;vertical-align:top}thead{background:#f2efff}small{color:#475569}.summary{display:flex;gap:16px;flex-wrap:wrap}.summary span{background:#f2efff;border-radius:12px;padding:12px 16px}@media print{body{margin:0;max-width:none}.summary span{border:1px solid #ddd}thead{background:#eee}tr{break-inside:avoid}}</style></head><body><h1>Weekly Study Planner</h1><p>Plan your week. Tick off sessions on paper after completing them.</p><div class="summary"><span><strong>${htmlEscape(schedule.scheduledDays)}</strong> planned days</span><span><strong>${htmlEscape(schedule.scheduledMinutes)}</strong> planned minutes</span><span><strong>${htmlEscape(schedule.benchmarkMinutes)}</strong> minute benchmark</span></div><table><thead><tr><th>Day</th><th>Duration</th><th>Suggested focus</th><th>Status</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No study days selected.</td></tr>'}</tbody></table><p><small>${htmlEscape(schedule.note)}</small></p><p><small>Planned only — not a record of completed study.</small></p></body></html>
`;
}
