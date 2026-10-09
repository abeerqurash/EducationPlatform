import { describe, expect, it } from "vitest";
import { summarizePracticeHistory } from "./practice-progress";
describe("practice history summaries", () => {
  it("returns zero totals for empty history", () => {
    expect(summarizePracticeHistory([])).toMatchObject({ attempts: 0, accuracy: 0, questions: 0 });
  });
  it("uses weighted question accuracy instead of averaging percentages", () => {
    const result = summarizePracticeHistory([
      { exam: "SAT", total: 1, correct: 1, percentage: 100, durationSeconds: 60, createdAt: "2026-10-01" },
      { exam: "SAT", total: 9, correct: 0, percentage: 0, durationSeconds: 120, createdAt: "2026-10-02" },
      { exam: "ACT", total: 10, correct: 5, percentage: 50, durationSeconds: 300, createdAt: "2026-10-03" },
    ]);
    expect(result).toMatchObject({ attempts: 3, questions: 20, correct: 6, accuracy: 30, durationSeconds: 480 });
    expect(result.exams).toEqual([
      { exam: "SAT", attempts: 2, questions: 10, correct: 1, accuracy: 10 },
      { exam: "ACT", attempts: 1, questions: 10, correct: 5, accuracy: 50 },
    ]);
  });
  it("rejects inconsistent history", () => {
    expect(() => summarizePracticeHistory([{ exam: "SAT", total: 2, correct: 3, percentage: 150, durationSeconds: 1, createdAt: "2026-10-01" }])).toThrow();
  });
});
