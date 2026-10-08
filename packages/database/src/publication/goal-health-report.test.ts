import { describe, expect, it } from "vitest";
import { createGoalHealthReport, formatGoalHealthCsv, formatGoalHealthJson, formatGoalHealthText } from "../../../../apps/web/src/app/dashboard/study-plan/health-report";

const goals = [
  { id: "1", title: "Maths, revision", targetDate: "2026-10-08", targetMinutes: 60, completedAt: null },
  { id: "2", title: "Physics", targetDate: "2026-10-12", targetMinutes: 90, completedAt: null },
  { id: "3", title: "Done", targetDate: "2026-10-01", targetMinutes: 15, completedAt: new Date("2026-10-02T00:00:00Z") },
];

describe("goal health reports", () => {
  it("uses open goals and stable UTC dates", () => {
    expect(createGoalHealthReport(goals, "2026-10-09")).toMatchObject({ asOfUtc: "2026-10-09", total: 3, completed: 1, overdue: 1, upcoming: 1, plannedMinutes: 150 });
  });
  it("CSV quotes titles containing commas", () => {
    expect(formatGoalHealthCsv(createGoalHealthReport(goals, "2026-10-09"))).toContain('"Maths, revision"');
  });
  it("JSON has versioned report metadata", () => {
    expect(JSON.parse(formatGoalHealthJson(createGoalHealthReport(goals, "2026-10-09")))).toMatchObject({ version: 1, report: { overdue: 1 } });
  });
  it("TXT lists deadlines and headline metrics", () => {
    const output = formatGoalHealthText(createGoalHealthReport(goals, "2026-10-09"));
    expect(output).toContain("Planned minutes: 150");
    expect(output).toContain("Maths, revision | 2026-10-08 | Overdue");
  });
  it("empty reports are valid in all formats", () => {
    const empty = createGoalHealthReport([], "2026-10-09");
    expect(formatGoalHealthCsv(empty)).toContain("Total goals");
    expect(JSON.parse(formatGoalHealthJson(empty)).report.total).toBe(0);
    expect(formatGoalHealthText(empty)).toContain("No scheduled open goals.");
  });
});
