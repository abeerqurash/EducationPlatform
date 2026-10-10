import { beforeEach, describe, expect, it, vi } from "vitest";

const fake = vi.hoisted(() => {
  const results: (unknown[] | Error)[] = [];
  const events: { kind: string; value?: unknown }[] = [];
  function operation(kind: string) {
    events.push({ kind });
    const result = results.shift() ?? [];
    const query: Record<string, unknown> = {};
    for (const key of ["from", "where", "orderBy", "limit", "for", "returning", "set", "values"]) query[key] = (value: unknown) => { events.push({ kind: key, value }); return query; };
    query.then = (resolve: (value: unknown[]) => unknown, reject: (error: Error) => unknown) => result instanceof Error ? Promise.reject(result).then(resolve, reject) : Promise.resolve(result).then(resolve, reject);
    return query;
  }
  const tx = { select: () => operation("select"), insert: () => operation("insert"), update: () => operation("update"), delete: () => operation("delete") };
  return { results, events, tx, transaction: vi.fn(async (callback: (value: typeof tx) => Promise<unknown>) => callback(tx)) };
});
vi.mock("../client", () => ({ db: { transaction: fake.transaction } }));
import { submitQuestionPractice, startQuestionPractice, saveQuestionPracticeDraft } from "./practice";

const userId = "11111111-1111-4111-8111-111111111111";
const sessionId = "22222222-2222-4222-8222-222222222222";
const revisionId = "33333333-3333-4333-8333-333333333333";
const attemptId = "44444444-4444-4444-8444-444444444444";
const active = { id: sessionId, userId, exam: "SAT", revisionIds: [revisionId], draftAnswers: [], createdAt: new Date(Date.now() - 60000), expiresAt: new Date(Date.now() + 3600000), submittedAt: null, submittedAttemptId: null };
const revision = { id: revisionId, entryId: revisionId, version: 1, status: "retired", content: { exam: "Both", topic: "Math", difficulty: "foundation", prompt: "What is the sum of 2 + 3?", choices: ["4", "5"], correct: 1, explanation: "Adding two and three gives a total of five.", source: "Original editorial question by our team." } };
beforeEach(() => { fake.results.length = 0; fake.events.length = 0; fake.transaction.mockClear(); });
describe("transactional library repository", () => {
  it("returns an existing result on retry without a second insert", async () => {
    fake.results.push([{ id: userId }], [{ ...active, submittedAt: new Date(), submittedAttemptId: attemptId }], [{ id: attemptId, percentage: 100 }]);
    expect(await submitQuestionPractice(userId, sessionId, [])).toEqual({ id: attemptId, percentage: 100 });
    expect(fake.events.some(row => row.kind === "insert")).toBe(false);
    expect(fake.events.filter(row => row.kind === "for").map(row => row.value)).toEqual(["update", "update"]);
  });
  it("rejects unavailable/cross-account sessions without saving", async () => {
    fake.results.push([{ id: userId }], []);
    await expect(submitQuestionPractice(userId, sessionId, [])).rejects.toThrow("unavailable");
    expect(fake.events.some(row => row.kind === "insert")).toBe(false);
  });
  it("saves pinned retired revisions and marks submission atomically", async () => {
    fake.results.push([{ id: userId }], [active], [revision], [{ id: attemptId, percentage: 100 }], []);
    await submitQuestionPractice(userId, sessionId, [{ questionId: revisionId, choice: 1 }]);
    const saved = fake.events.find(row => row.kind === "values")?.value as { questionSnapshots: { version: number }[]; correct: number };
    expect(saved.questionSnapshots).toHaveLength(1); expect(saved.questionSnapshots[0]?.version).toBe(1); expect(saved.correct).toBe(1);
    expect(fake.events.some(row => row.kind === "update")).toBe(true); expect(fake.transaction).toHaveBeenCalledTimes(1);
  });
  it("does not mark a session submitted when the attempt insert fails", async () => {
    fake.results.push([{ id: userId }], [active], [revision], new Error("insert failed"));
    await expect(submitQuestionPractice(userId, sessionId, [])).rejects.toThrow("insert failed");
    expect(fake.events.some(row => row.kind === "update")).toBe(false);
  });
  it("does not recreate an attempt that the student deleted", async () => {
    fake.results.push([{ id: userId }], [{ ...active, submittedAt: new Date(), submittedAttemptId: null }]);
    await expect(submitQuestionPractice(userId, sessionId, [])).rejects.toThrow("deleted");
    expect(fake.events.some(row => row.kind === "insert")).toBe(false);
  });
  it("prevents inactive accounts and concurrent open sessions", async () => {
    fake.results.push([]); await expect(startQuestionPractice(userId, "SAT")).rejects.toThrow("Active account");
    fake.results.push([{ id: userId }], [active]); await expect(startQuestionPractice(userId, "SAT")).rejects.toThrow("Resume");
  });
  it("validates saved drafts before any update", async () => {
    fake.results.push([{ id: userId }], [active], [revision]);
    await expect(saveQuestionPracticeDraft(userId, sessionId, [{ questionId: attemptId, choice: 0 }])).rejects.toThrow();
    expect(fake.events.some(row => row.kind === "update")).toBe(false);
  });
});
