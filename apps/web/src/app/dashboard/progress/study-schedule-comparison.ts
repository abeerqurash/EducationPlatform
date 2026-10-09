import { WEEK_DAYS, type WeekDay, type WeeklyStudySchedule } from "./study-weekly-schedule";

export type StudyScheduleComparison = {
  baselineName: string;
  plannedMinutes: number;
  baselineMinutes: number;
  differenceMinutes: number;
  differencePercent: number | null;
  daysAdded: WeekDay[];
  daysRemoved: WeekDay[];
  daysChanged: { day: WeekDay; planned: number; baseline: number; difference: number }[];
  summary: string;
};

export function compareStudySchedules(current: WeeklyStudySchedule, baseline: WeeklyStudySchedule, baselineName = "Reference schedule"): StudyScheduleComparison {
  const currentMap = new Map(current.entries.map(entry => [entry.day, entry.minutes]));
  const baselineMap = new Map(baseline.entries.map(entry => [entry.day, entry.minutes]));
  const daysAdded = WEEK_DAYS.filter(day => currentMap.has(day) && !baselineMap.has(day));
  const daysRemoved = WEEK_DAYS.filter(day => !currentMap.has(day) && baselineMap.has(day));
  const daysChanged = WEEK_DAYS.filter(day => currentMap.has(day) && baselineMap.has(day) && currentMap.get(day) !== baselineMap.get(day)).map(day => ({ day, planned: currentMap.get(day)!, baseline: baselineMap.get(day)!, difference: currentMap.get(day)! - baselineMap.get(day)! }));
  const plannedMinutes = current.entries.reduce((sum, entry) => sum + entry.minutes, 0);
  const baselineMinutes = baseline.entries.reduce((sum, entry) => sum + entry.minutes, 0);
  const differenceMinutes = plannedMinutes - baselineMinutes;
  const differencePercent = baselineMinutes ? Math.round((differenceMinutes / baselineMinutes) * 1000) / 10 : null;
  const summary = differenceMinutes === 0 ? "Both schedules allocate the same total study time." : differenceMinutes > 0 ? `Your schedule plans ${differenceMinutes} more minutes per week.` : `Your schedule plans ${Math.abs(differenceMinutes)} fewer minutes per week.`;
  return { baselineName, plannedMinutes, baselineMinutes, differenceMinutes, differencePercent, daysAdded, daysRemoved, daysChanged, summary };
}

export function formatStudyScheduleComparisonText(comparison: StudyScheduleComparison): string {
  return ["WEEKLY STUDY SCHEDULE COMPARISON", "", `Compared with: ${comparison.baselineName}`, `Your planned minutes: ${comparison.plannedMinutes}`, `Reference minutes: ${comparison.baselineMinutes}`, `Difference: ${comparison.differenceMinutes > 0 ? "+" : ""}${comparison.differenceMinutes} minutes`, `Difference percentage: ${comparison.differencePercent === null ? "Not applicable (zero reference minutes)" : `${comparison.differencePercent}%`}`, "", comparison.summary, "", `Added study days: ${comparison.daysAdded.join(", ") || "None"}`, `Removed study days: ${comparison.daysRemoved.join(", ") || "None"}`, ...comparison.daysChanged.map(item => `${item.day}: ${item.baseline} → ${item.planned} minutes (${item.difference > 0 ? "+" : ""}${item.difference})`), "", "Comparison of proposed plans only. Neither schedule records completed study activity.", ""].join("\n");
}

export function formatStudyScheduleComparisonCsv(comparison: StudyScheduleComparison): string {
  const escape = (value: string | number) => { const text = String(value); const safe = /^[\s]*[=+@-]/.test(text) && typeof value === "string" ? `'${text}` : text; return `"${safe.replace(/"/g, '""')}"`; };
  return ["metric,value", ...[["reference", comparison.baselineName], ["planned_minutes", comparison.plannedMinutes], ["reference_minutes", comparison.baselineMinutes], ["difference_minutes", comparison.differenceMinutes], ["difference_percent", comparison.differencePercent ?? "N/A"], ["added_days", comparison.daysAdded.join("; ")], ["removed_days", comparison.daysRemoved.join("; ")], ["changed_days", comparison.daysChanged.map(item => `${item.day}: ${item.baseline} to ${item.planned}`).join("; ")]].map(([key, value]) => `${escape(key)},${escape(value)}`)].join("\r\n") + "\r\n";
}
