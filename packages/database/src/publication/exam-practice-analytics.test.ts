import { describe, expect, it } from "vitest";
import { formatCountdown, formatPracticeTopicReport, summarizePracticeTopics } from "../../../../apps/web/src/app/dashboard/test-prep/practice/practice-analytics";
import { selectPracticeQuestions } from "../../../../apps/web/src/app/dashboard/test-prep/practice/question-bank";
const questions = selectPracticeQuestions("ACT", "All", 24);
describe("practice topic analytics and timer", () => {
  it("summarizes only topics present", () => { const rows = summarizePracticeTopics(questions, []); expect(rows.map(x=>x.topic)).toEqual(["Math","Reading","English","Science"]); });
  it("counts unanswered items", () => { const rows = summarizePracticeTopics(questions, []); expect(rows.every(x=>x.unanswered===x.total)).toBe(true); });
  it("counts correct answers", () => { const rows = summarizePracticeTopics(questions, questions.map(q=>({id:q.id,choice:q.correct}))); expect(rows.every(x=>x.percentage===100)).toBe(true); });
  it("counts wrong answers", () => { const rows = summarizePracticeTopics(questions, questions.map(q=>({id:q.id,choice:(q.correct+1)%4}))); expect(rows.every(x=>x.incorrect===x.total)).toBe(true); });
  it("reports partial answers", () => { const rows = summarizePracticeTopics(questions,[{id:questions[0]!.id,choice:questions[0]!.correct}]); expect(rows[0]?.correct).toBe(1); });
  it("handles empty question lists", () => { expect(summarizePracticeTopics([],[])).toEqual([]); });
  it("formats countdown", () => { expect(formatCountdown(125)).toBe("02:05"); });
  it("clamps negative countdown", () => { expect(formatCountdown(-10)).toBe("00:00"); });
  it("clamps nonfinite countdown", () => { expect(formatCountdown(Infinity)).toBe("00:00"); });
  it("floors fractional countdown", () => { expect(formatCountdown(61.9)).toBe("01:01"); });
  it("exports performance and time", () => { const text = formatPracticeTopicReport(questions,[],125); expect(text).toContain("Elapsed time: 2m 5s"); expect(text).toContain("Science:"); });
  it("does not claim official scores", () => { expect(formatPracticeTopicReport(questions,[],0)).toContain("not an official exam score"); });
});
