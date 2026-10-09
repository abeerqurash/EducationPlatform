import { describe, expect, it } from "vitest";
import { PRACTICE_QUESTIONS, gradePracticeSession, practiceReport, selectPracticeQuestions } from "../../../../apps/web/src/app/dashboard/test-prep/practice/question-bank";
describe("original exam practice question engine", () => {
 it("has unique identifiers and valid answer indices", () => { expect(new Set(PRACTICE_QUESTIONS.map(q=>q.id)).size).toBe(PRACTICE_QUESTIONS.length); for(const q of PRACTICE_QUESTIONS){expect(q.choices).toHaveLength(4);expect(q.correct).toBeGreaterThanOrEqual(0);expect(q.correct).toBeLessThan(4);expect(q.explanation.length).toBeGreaterThan(10);} });
 it("filters ACT science out of SAT", () => { expect(selectPracticeQuestions("SAT").every(q=>q.topic!=="Science")).toBe(true); expect(selectPracticeQuestions("ACT","Science").length).toBe(4); });
 it("honors topic filters", () => { expect(selectPracticeQuestions("SAT","Math").every(q=>q.topic==="Math")).toBe(true); });
 it("clamps question limits", () => {expect(selectPracticeQuestions("ACT","All",999).length).toBeLessThanOrEqual(24);expect(selectPracticeQuestions("SAT","Math",0)).toHaveLength(1);});
 it("handles invalid question limits", () => {expect(selectPracticeQuestions("SAT","All",NaN)).toHaveLength(10);});
 it("grades correct responses", () => {const qs=selectPracticeQuestions("SAT","Math",2);const result=gradePracticeSession(qs,qs.map(q=>({id:q.id,choice:q.correct})));expect(result.correct).toBe(2);expect(result.percentage).toBe(100);});
 it("counts unanswered and incorrect independently", () => {const qs=selectPracticeQuestions("SAT","Math",3);const result=gradePracticeSession(qs,[{id:qs[0].id,choice:(qs[0].correct+1)%4}]);expect(result.answered).toBe(1);expect(result.incorrect).toBe(1);expect(result.unanswered).toBe(2);});
 it("does not grade out-of-range answers as answered", () => {const qs=selectPracticeQuestions("SAT","Math",1);expect(gradePracticeSession(qs,[{id:qs[0].id,choice:99}]).answered).toBe(0);});
 it("does not score unrelated answers", () => {const qs=selectPracticeQuestions("SAT","Math",1);expect(gradePracticeSession(qs,[{id:"other",choice:0}]).answered).toBe(0);});
 it("handles empty questions", () => {expect(gradePracticeSession([],[]).percentage).toBe(0);});
 it("exports explanations and nonofficial disclaimer", () => {const qs=selectPracticeQuestions("ACT","Science",1);const report=practiceReport("ACT",qs,[]);expect(report).toContain("Not an official ACT score");expect(report).toContain(qs[0].explanation);});
});
