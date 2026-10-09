import { describe, expect, it } from "vitest";
import { practiceHistoryCsv } from "./practice-csv";
describe("practice CSV", () => {
  it("writes a header for empty history", () => {
    expect(practiceHistoryCsv([])).toBe("Date,Exam,Questions,Correct,Percentage,Duration seconds");
  });
  it("exports dates and prevents formula injection", () => {
    const csv = practiceHistoryCsv([{ exam: "=IMPORTXML()", total: 2, correct: 1, percentage: 50, durationSeconds: 10, createdAt: "2026-10-10T00:00:00Z" }]);
    expect(csv).toContain("2026-10-10T00:00:00.000Z");
    expect(csv).toContain("'=IMPORTXML()");
  });
});
