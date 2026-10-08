/** Export the same 30 UTC-day aggregate already displayed on the Progress dashboard. */
export type ProgressExport = {
  daily: { day: string; minutes: number; activities: number }[];
  totalMinutes: number;
  activeDays: number;
  activityCount: number;
};

export function formatProgressJson(progress: ProgressExport): string {
  return JSON.stringify({
    schemaVersion: 1,
    exportType: `study-progress-${progress.daily.length}-day`,
    timezone: "UTC",
    periodStart: progress.daily[0]?.day ?? null,
    periodEnd: progress.daily.at(-1)?.day ?? null,
    totals: {
      minutes: progress.totalMinutes,
      activeDays: progress.activeDays,
      activities: progress.activityCount,
    },
    days: progress.daily,
  }, null, 2) + "\n";
}

/** Quote every cell and prevent spreadsheet programs from interpreting formulas. */
function csvCell(value: string | number): string {
  const input = String(value);
  const safe = /^[\s\u0000-\u001f]*[=+@-]/u.test(input) ? `\'${input}` : input;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function formatProgressCsv(progress: ProgressExport): string {
  const header = ["UTC date", "Recorded minutes", "Activities"];
  const lines = progress.daily.map((day) => [day.day, day.minutes, day.activities]);
  return "\uFEFF" + [header, ...lines].map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

/** Accessible plain-text daily study log, including days without activity. */
export function formatProgressText(progress: ProgressExport): string {
  const lines = [`EducationPlatform — ${progress.daily.length}-Day Study Progress`, "Timezone: UTC",
    `Period: ${progress.daily[0]?.day ?? "N/A"} to ${progress.daily.at(-1)?.day ?? "N/A"}`,
    `Total recorded minutes: ${progress.totalMinutes}`,
    `Active days: ${progress.activeDays}`,
    `Activities: ${progress.activityCount}`, "", "Daily activity:"];
  for (const day of progress.daily) {
    lines.push(`${day.day}: ${day.minutes} minutes, ${day.activities} activities`);
  }
  return lines.join("\n") + "\n";
}
