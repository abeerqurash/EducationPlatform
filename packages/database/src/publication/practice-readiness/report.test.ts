import { describe, expect, it } from "vitest";
import { buildReadinessReport, readinessExam, readinessReportText } from "./report";
import type { Attempt } from "./shared";

const rows: [Attempt, Attempt] = [
  { exam: "ACT", total: 10, answered: 10, correct: 10, durationSeconds: 120, createdAt: "2026-10-02T00:00:00Z" },
  { exam: "SAT", total: 2, answered: 1, correct: 1, durationSeconds: 60, createdAt: "2026-10-01T00:00:00Z" },
];
const value = (report: ReturnType<typeof buildReadinessReport>, label: string) => report.metrics.find(row => row.label === label)?.value;
describe("readiness report", () => {
  it("distinguishes weighted score, session average, and answered accuracy", () => {
    const report = buildReadinessReport(rows);
    expect(value(report, "Question-weighted score")).toBe(92);
    expect(value(report, "Session-average score")).toBe(75);
    expect(value(report, "Answered-question accuracy")).toBe(100);
  });
  it("filters exams without mutating the input", () => {
    const original = JSON.stringify(rows);
    const report = buildReadinessReport(rows, "SAT");
    expect(report.matchingSessions).toBe(1);
    expect(value(report, "ACT question score")).toBeNull();
    expect(JSON.stringify(rows)).toBe(original);
  });
  it("uses no-data rather than zero for missing measurements", () => {
    const report = buildReadinessReport([]);
    expect(value(report, "Question-weighted score")).toBeNull();
    expect(value(report, "Sessions")).toBe(0);
    expect(report.firstSession).toBeNull();
    expect(report.recommendations).toHaveLength(1);
  });
  it("does not compare one session to itself as improvement", () => {
    expect(value(buildReadinessReport(rows, "SAT"), "First-to-latest change")).toBeNull();
  });
  it("excludes corrupt counts and dates and reports their exclusion", () => {
    const report = buildReadinessReport([...rows, { ...rows[0], correct: 11 }, { ...rows[0], createdAt: "bad" }]);
    expect(report.matchingSessions).toBe(2);
    expect(report.excludedSessions).toBe(2);
  });
  it("does not divide by zero for unanswered or zero-duration sessions", () => {
    const report = buildReadinessReport([{ ...rows[0], answered: 0, correct: 0, durationSeconds: 0 }]);
    expect(value(report, "Answered-question accuracy")).toBeNull();
    expect(value(report, "Correct answers per minute")).toBeNull();
    expect(report.recommendations.join(" ")).toContain("unanswered");
  });
  it("orders chronology and uses UTC timestamps", () => {
    const report = buildReadinessReport(rows);
    expect(report.firstSession).toBe("2026-10-01T00:00:00.000Z");
    expect(value(report, "First-to-latest change")).toBe(50);
  });
  it("guides mixed-exam users to filter and perfect scorers to vary items", () => {
    expect(buildReadinessReport(rows).recommendations.join(" ")).toContain("filter");
    expect(buildReadinessReport([rows[0]]).recommendations.join(" ")).toContain("different questions");
  });
  it("normalizes malformed and repeated query values", () => {
    for (const query of [undefined, "GRE", ["SAT", "ACT"], "sat"]) expect(readinessExam(query)).toBe("All");
    expect(readinessExam("ACT")).toBe("ACT");
  });
  it("exports units, caveats, and no-data markers", () => {
    const text = readinessReportText(buildReadinessReport([]));
    expect(text).toContain("No data");
    expect(text).toContain("not lifetime history");
    expect(text).toContain("do not predict official");
  });
  it("omits extra private properties from report serialization", () => {
    const privateRow = { ...rows[0], email: "private@example.com", userId: "private-id" };
    const report = buildReadinessReport([privateRow]);
    expect(JSON.stringify(report)).not.toContain("private");
  });
});
