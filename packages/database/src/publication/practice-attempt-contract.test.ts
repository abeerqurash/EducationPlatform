import { describe, expect, it } from "vitest";
import { gradeTrustedPracticeAttempt, InvalidPracticeAttempt, type PracticeQuestionKey } from "./practice-attempt-contract";

const bank: PracticeQuestionKey[] = [
  { id: "math_1", exam: "Both", topic: "Math", correct: 2, choiceCount: 4 },
  { id: "reading_1", exam: "SAT", topic: "Reading", correct: 0, choiceCount: 4 },
  { id: "science_1", exam: "ACT", topic: "Science", correct: 1, choiceCount: 4 },
];
const base = {
  exam: "SAT", questionIds: ["math_1", "reading_1"],
  answers: [{ questionId: "math_1", choice: 2 }],
  startedAt: "2026-10-10T10:00:00.000Z", submittedAt: "2026-10-10T10:02:30.000Z",
};
describe("trusted practice attempt contract", () => {
  it("grades correct, incorrect and unanswered using trusted keys", () => {
    expect(gradeTrustedPracticeAttempt(base, bank)).toMatchObject({
      total: 2, answered: 1, correct: 1, incorrect: 0,
      unanswered: 1, percentage: 50, durationSeconds: 150,
      topicBreakdown: [
        { topic: "Math", total: 1, answered: 1, correct: 1 },
        { topic: "Reading", total: 1, answered: 0, correct: 0 },
      ],
    });
  });
  it("counts wrong choices as incorrect", () => {
    expect(gradeTrustedPracticeAttempt({
      ...base, answers: [{ questionId: "math_1", choice: 0 }],
    }, bank)).toMatchObject({ correct: 0, incorrect: 1, unanswered: 1 });
  });
  it.each([
    { ...base, exam: "GRE" },
    { ...base, questionIds: [] },
    { ...base, questionIds: ["math_1", "math_1"] },
    { ...base, questionIds: ["science_1"] },
    { ...base, questionIds: ["not_in_bank"] },
    { ...base, answers: [{ questionId: "reading_1", choice: 4 }] },
    { ...base, answers: [{ questionId: "math_1", choice: -1 }] },
    { ...base, answers: [{ questionId: "math_1", choice: 1.5 }] },
    { ...base, answers: [{ questionId: "math_1", choice: 2 }, { questionId: "math_1", choice: 1 }] },
    { ...base, answers: [{ questionId: "science_1", choice: 1 }] },
    { ...base, submittedAt: "2026-10-10T09:59:00.000Z" },
    { ...base, startedAt: "not-a-date" },
  ])("rejects invalid or tampered payload %#", input => {
    expect(() => gradeTrustedPracticeAttempt(input, bank)).toThrow(InvalidPracticeAttempt);
  });
  it("enforces configurable resource limits", () => {
    expect(() => gradeTrustedPracticeAttempt(base, bank, { maxQuestions: 1 })).toThrow();
    expect(() => gradeTrustedPracticeAttempt(base, bank, { maxDurationSeconds: 60 })).toThrow();
  });
  it("rejects corrupt trusted answer keys", () => {
    expect(() => gradeTrustedPracticeAttempt(base, [{ ...bank[0], correct: 99 }, bank[1]])).toThrow();
    expect(() => gradeTrustedPracticeAttempt(base, [bank[0], bank[0], bank[1]])).toThrow();
  });
});
