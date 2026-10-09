import { describe, expect, it } from "vitest";
import { selectPracticeQuestions } from "../../../../apps/web/src/app/dashboard/test-prep/practice/question-bank";
import { shufflePracticeQuestions, getRetryQuestions, formatRetrySummary } from "../../../../apps/web/src/app/dashboard/test-prep/practice/practice-retry";
const questions = selectPracticeQuestions("ACT", "All", 12);
describe("practice retry and question order", () => {
  it("keeps the bank unchanged", () => { const original = questions.map(q=>q.id); shufflePracticeQuestions(questions,42); expect(questions.map(q=>q.id)).toEqual(original); });
  it("preserves every question exactly once", () => { expect(shufflePracticeQuestions(questions,42).map(q=>q.id).sort()).toEqual(questions.map(q=>q.id).sort()); });
  it("repeats the same order for the same seed", () => { expect(shufflePracticeQuestions(questions,42)).toEqual(shufflePracticeQuestions(questions,42)); });
  it("produces a different order for a different seed", () => { expect(shufflePracticeQuestions(questions,42).map(q=>q.id)).not.toEqual(shufflePracticeQuestions(questions,43).map(q=>q.id)); });
  it("handles invalid seed", () => { expect(shufflePracticeQuestions(questions,NaN)).toHaveLength(questions.length); });
  it("handles empty question lists", () => { expect(shufflePracticeQuestions([],1)).toEqual([]); expect(getRetryQuestions([],[])).toEqual([]); });
  it("retries unanswered questions", () => { expect(getRetryQuestions(questions,[])).toHaveLength(questions.length); });
  it("does not retry correct answers", () => { const answers=questions.map(q=>({id:q.id,choice:q.correct})); expect(getRetryQuestions(questions,answers)).toEqual([]); });
  it("retries only incorrect and unanswered answers", () => { const answers=[{id:questions[0].id,choice:questions[0].correct},{id:questions[1].id,choice:(questions[1].correct+1)%4}]; expect(getRetryQuestions(questions,answers).map(q=>q.id)).toEqual(questions.slice(1).map(q=>q.id)); });
  it("ignores answers for unrelated questions", () => { expect(getRetryQuestions(questions,[{id:"unknown",choice:0}])).toHaveLength(questions.length); });
  it("includes actionable report details", () => { const report=formatRetrySummary(questions,[]); expect(report).toContain(`Questions to revisit: ${questions.length}`); expect(report).toContain("not an official exam score"); });
  it("reports a clear completed review", () => { const answers=questions.map(q=>({id:q.id,choice:q.correct})); expect(formatRetrySummary(questions,answers)).toContain("Questions to revisit: 0"); });
});
