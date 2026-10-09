import { describe, expect, it } from "vitest";
import { activityExportFilename, formatStudyActivityExport } from "../../../../apps/web/src/components/dashboard/study-activity-export";
import { filterStudyActivities } from "../../../../apps/web/src/components/dashboard/study-activity-filter";

const rows = [
  { id: "a", title: "SAT practice", activityType: "study_session", durationMinutes: 35, createdAt: "2026-10-08T10:00:00Z", manual: true },
  { id: "b", title: '=HYPERLINK("evil")', activityType: "calculator", durationMinutes: 0, createdAt: "2026-10-09T10:00:00Z", manual: false },
];
describe("filtered study activity export", () => {
  it("exports structured versioned JSON", () => {
    const data = JSON.parse(formatStudyActivityExport(rows, "json"));
    expect(data.version).toBe(1);
    expect(data.timezone).toBe("UTC");
    expect(data.activities).toHaveLength(2);
    expect(data.activities[0].manuallyLogged).toBe(true);
  });
  it("escapes spreadsheet formulas and quotes", () => {
    const csv = formatStudyActivityExport(rows, "csv");
    expect(csv).toContain("'=");
    expect(csv).toContain('""evil""');
    expect(csv.split("\r\n")).toHaveLength(4);
  });
  it("does not include filtered-out records", () => {
    const matching = filterStudyActivities(rows, { query: "SAT", type: "sessions", sort: "newest" });
    expect(formatStudyActivityExport(matching, "txt")).toContain("SAT practice");
    expect(formatStudyActivityExport(matching, "txt")).not.toContain("HYPERLINK");
  });
  it("handles empty exports without crashing", () => {
    expect(JSON.parse(formatStudyActivityExport([], "json")).count).toBe(0);
    expect(formatStudyActivityExport([], "csv")).toContain("Title");
  });
  it("normalizes dates and text newlines", () => {
    const text = formatStudyActivityExport([{...rows[0], title:"A\nB", createdAt:"invalid"}], "txt");
    expect(text).toContain("A B");
    expect(text).toContain("Unknown");
  });
  it("uses safe predictable file extensions", () => {
    expect(activityExportFilename("csv")).toBe("study-activity-filtered.csv");
    expect(activityExportFilename("json")).toBe("study-activity-filtered.json");
  });
});
