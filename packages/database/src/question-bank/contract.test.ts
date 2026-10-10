import { describe, expect, it } from "vitest";
import { authorizeQuestionTransition, gradeLibrarySession, isQuestionId, parseLibraryAnswers, parseQuestionContent, questionBankPermissions, questionSlug, reviewReason, studentQuestion, type QuestionContent, type QuestionSnapshot } from "./contract";

const id = "11111111-1111-4111-8111-111111111111";
const otherId = "22222222-2222-4222-8222-222222222222";
const author = { userId: id, permissionKeys: [questionBankPermissions.author] };
const reviewer = { userId: otherId, permissionKeys: [questionBankPermissions.review] };
const content: QuestionContent = { exam: "Both", topic: "Math", difficulty: "foundation", prompt: "What is the value of 2 + 3?", choices: ["4", "5", "6"], correct: 1, explanation: "Adding two and three gives a total of five.", source: "Original instructional question by our team." };
const snapshot: QuestionSnapshot = { ...content, id, entryId: otherId, version: 1 };
const start = new Date("2026-10-10T10:00:00Z");
const session = { exam: "SAT", revisionIds: [id], createdAt: start, expiresAt: new Date(start.getTime() + 14400000) };
const now = new Date(start.getTime() + 30000);

describe("question validation", () => {
  it("normalizes plain text without mutating the source", () => { const original = JSON.stringify(content); const result = parseQuestionContent({ ...content, prompt: ` ${content.prompt} `, status: "published" }); expect(result.prompt).toBe(content.prompt); expect(result).not.toHaveProperty("status"); expect(JSON.stringify(content)).toBe(original); });
  it.each([null, [], {}, { ...content, correct: 99 }, { ...content, correct: 1.5 }, { ...content, correct: "1" }, { ...content, choices: ["same", "SAME"] }, { ...content, choices: ["", "valid"] }, { ...content, choices: ["one"] }, { ...content, explanation: "short" }, { ...content, source: "" }, { ...content, exam: "GRE" }, { ...content, topic: "Unknown" }, { ...content, difficulty: "expert" }, { ...content, prompt: "x".repeat(10001) }])("rejects invalid content %#", input => { expect(() => parseQuestionContent(input)).toThrow(); });
  it("limits science to ACT and accepts six valid choices", () => { expect(() => parseQuestionContent({ ...content, topic: "Science" })).toThrow("ACT-only"); expect(parseQuestionContent({ ...content, topic: "Science", exam: "ACT", choices: ["1", "2", "3", "4", "5", "6"], correct: 5 }).correct).toBe(5); });
  it("validates slugs and UUIDs", () => { expect(questionSlug("math-001")).toBe("math-001"); for (const bad of ["Bad Slug", "../unsafe", "a".repeat(101), "-math"]) expect(() => questionSlug(bad)).toThrow(); expect(isQuestionId(id)).toBe(true); expect(isQuestionId("m01")).toBe(false); });
  it("requires substantive review notes", () => { expect(() => reviewReason("ok")).toThrow(); expect(reviewReason(" Reviewed all answers ")).toBe("Reviewed all answers"); });
});
describe("independent editorial review", () => {
  it("allows an author to submit their draft", () => expect(authorizeQuestionTransition(author, { status: "draft", authorUserId: id }, "submit")).toBe("in_review"));
  it("allows another reviewer to publish/reject", () => { expect(authorizeQuestionTransition(reviewer, { status: "in_review", authorUserId: id }, "publish")).toBe("published"); expect(authorizeQuestionTransition(reviewer, { status: "in_review", authorUserId: id }, "reject")).toBe("rejected"); });
  it("prevents self-review even with both permissions", () => expect(() => authorizeQuestionTransition({ ...author, permissionKeys: Object.values(questionBankPermissions) }, { status: "in_review", authorUserId: id }, "publish")).toThrow("different reviewer"));
  it("does not treat platform admin/calculator permissions as question grants", () => expect(() => authorizeQuestionTransition({ userId: otherId, permissionKeys: ["platform.admin.access", "calculators.publish"] }, { status: "in_review", authorUserId: id }, "publish")).toThrow("permission"));
  it("prevents publishing a draft, resubmitting a reviewed version and submitting another author's draft", () => { expect(() => authorizeQuestionTransition(reviewer, { status: "draft", authorUserId: id }, "publish")).toThrow(); expect(() => authorizeQuestionTransition(author, { status: "published", authorUserId: id }, "submit")).toThrow(); expect(() => authorizeQuestionTransition({ ...author, userId: otherId }, { status: "draft", authorUserId: id }, "submit")).toThrow(); });
  it("allows retirement only from published", () => { expect(authorizeQuestionTransition(reviewer, { status: "published", authorUserId: id }, "retire")).toBe("retired"); expect(() => authorizeQuestionTransition(reviewer, { status: "retired", authorUserId: id }, "retire")).toThrow(); });
});
describe("private version-pinned practice", () => {
  it("strips the answer key, explanation and source before sending a question", () => { const view = studentQuestion(snapshot); expect(view).not.toHaveProperty("correct"); expect(view).not.toHaveProperty("explanation"); expect(view).not.toHaveProperty("source"); expect(view.choices).not.toBe(snapshot.choices); });
  it("grades the chosen revision and computes elapsed time on server timestamps", () => { const result = gradeLibrarySession(session, [snapshot], [{ questionId: id, choice: 1 }], now); expect(result.percentage).toBe(100); expect(result.durationSeconds).toBe(30); });
  it("keeps historical scoring independent of a later version", () => { const revised = { ...snapshot, id: otherId, version: 2, correct: 0 }; const result = gradeLibrarySession(session, [snapshot, revised], [{ questionId: id, choice: 1 }], now); expect(result.correct).toBe(1); expect(result.questionIds).toEqual([id]); });
  it("accepts all-unanswered submissions", () => { const result = gradeLibrarySession(session, [snapshot], [], now); expect(result.unanswered).toBe(1); expect(result.correct).toBe(0); });
  it("rejects expired sessions and time before the server start", () => { expect(() => gradeLibrarySession(session, [snapshot], [], new Date(session.expiresAt.getTime() + 1))).toThrow("expired"); expect(() => gradeLibrarySession(session, [snapshot], [], new Date(start.getTime() - 1))).toThrow("expired"); });
  it("rejects unknown/missing/duplicate revisions and incompatible exams", () => { expect(() => gradeLibrarySession(session, [], [], now)).toThrow(); expect(() => gradeLibrarySession(session, [snapshot, snapshot], [], now)).toThrow(); expect(() => gradeLibrarySession(session, [{ ...snapshot, exam: "ACT" }], [], now)).toThrow(); expect(() => gradeLibrarySession(session, [snapshot], [{ questionId: otherId, choice: 0 }], now)).toThrow(); });
  it("rejects duplicate choices, malformed IDs and out-of-range indices", () => { for (const bad of [[{ questionId: id, choice: 0 }, { questionId: id, choice: 1 }], [{ questionId: "fake", choice: 0 }], [{ questionId: id, choice: -1 }], [{ questionId: id, choice: "1" }]]) expect(() => parseLibraryAnswers(bad)).toThrow(); expect(() => gradeLibrarySession(session, [snapshot], [{ questionId: id, choice: 5 }], now)).toThrow(); });
});
