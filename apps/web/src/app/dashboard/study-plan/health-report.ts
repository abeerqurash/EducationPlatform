import { summarizeGoalHealth, type GoalInsightRecord } from "./goal-insights";

export type GoalHealthReport = ReturnType<typeof summarizeGoalHealth> & { asOfUtc: string };

export function createGoalHealthReport(goals: readonly GoalInsightRecord[], todayUtc: string): GoalHealthReport {
  return { asOfUtc: todayUtc, ...summarizeGoalHealth(goals, todayUtc) };
}

function csvCell(value: string | number): string {
  const raw = String(value);
  const safe = /^[\s\u0000-\u001f]*[=+@-]/.test(raw) ? `\'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function formatGoalHealthCsv(report: GoalHealthReport): string {
  const summary: Array<[string, string | number]> = [
    ["As of (UTC)", report.asOfUtc], ["Total goals", report.total],
    ["Open goals", report.open], ["Completed goals", report.completed],
    ["Completion rate (%)", report.completionRate], ["Overdue goals", report.overdue],
    ["Due today", report.dueToday], ["Due in next 7 days", report.upcoming],
    ["Unscheduled goals", report.unscheduled], ["Planned minutes", report.plannedMinutes],
  ];
  return ["Metric,Value", ...summary.map((row) => row.map(csvCell).join(",")),
    "", "Upcoming deadline preview (maximum 8)", "Goal,Deadline (UTC),Status",
    ...report.deadlines.map((goal) => [goal.title, goal.targetDate, goal.status].map(csvCell).join(",")), ""].join("\r\n");
}

export function formatGoalHealthJson(report: GoalHealthReport): string {
  return JSON.stringify({ version: 1, report }, null, 2) + "\n";
}

export function formatGoalHealthText(report: GoalHealthReport): string {
  const metrics = [
    `As of (UTC): ${report.asOfUtc}`, `Total goals: ${report.total}`,
    `Open goals: ${report.open}`, `Completed goals: ${report.completed}`,
    `Completion rate: ${report.completionRate}%`, `Overdue: ${report.overdue}`,
    `Due today: ${report.dueToday}`, `Due in next 7 days: ${report.upcoming}`,
    `Without deadlines: ${report.unscheduled}`, `Planned minutes: ${report.plannedMinutes}`,
  ];
  return ["EducationPlatform - Goal Health Report", "", ...metrics, "", "Next deadlines (maximum 8):",
    ...(report.deadlines.length ? report.deadlines.map((g) => `- ${g.title} | ${g.targetDate} | ${g.status}`) : ["No scheduled open goals."]), ""].join("\n");
}
