import { describe, expect, it } from "vitest";
import { formatFilteredGoals, filteredGoalFilename } from "../../../../apps/web/src/components/dashboard/study-goal-filtered-export";
import { filterAndSortGoals } from "../../../../apps/web/src/components/dashboard/study-goal-filter";
const filters = { query: "math", status: "open", deadline: "all", sort: "title" };
const rows = [
  { id: "1", title: "=2+2", description: "Hello, \"world\"", targetDate: null, targetMinutes: 30, completedAt: null },
  { id: "2", title: "Math revision", description: null, targetDate: "2026-10-10", targetMinutes: 60, completedAt: null },
  { id: "3", title: "Biology", description: null, targetDate: null, targetMinutes: 10, completedAt: null },
];
describe("filtered goal workspace downloads", () => {
  it("exports only matching goals in sorted order", () => { const filtered = filterAndSortGoals(rows, filters, "2026-10-09"); const json = JSON.parse(formatFilteredGoals(filtered, filters, "json", "2026-10-09T00:00:00Z")); expect(json.count).toBe(1); expect(json.goals[0].id).toBe("2"); expect(json.filters).toEqual(filters); });
  it("escapes CSV quotes and prevents spreadsheet formula injection", () => { const csv = formatFilteredGoals(rows.slice(0, 1), filters, "csv", "2026-10-09"); expect(csv).toContain('"\'=2+2"'); expect(csv).toContain('"Hello, ""world"""'); });
  it("supports readable TXT without a data mutation", () => { const before = JSON.stringify(rows); const txt = formatFilteredGoals(rows, filters, "txt", "2026-10-09"); expect(txt).toContain("Matching goals: 3"); expect(txt).toContain("Status: Open"); expect(JSON.stringify(rows)).toBe(before); });
  it("produces predictable safe filenames", () => { expect(filteredGoalFilename("json", "2026-10-09")).toBe("study-goals-filtered-2026-10-09.json"); expect(filteredGoalFilename("csv", "../../foo")).toBe("study-goals-filtered-export.csv"); });
  it("supports empty filtered results", () => { expect(JSON.parse(formatFilteredGoals([], filters, "json", "now")).goals).toEqual([]); });
});
