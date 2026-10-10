/** Full repository acceptance. Requires a separate EMPTY disposable database. */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "dotenv";
import postgres from "postgres";
import { eq } from "drizzle-orm";

const directory = path.dirname(fileURLToPath(import.meta.url));
const testUrl = process.env.QUESTION_BANK_TEST_DATABASE_URL;
if (!testUrl) throw new Error("Set QUESTION_BANK_TEST_DATABASE_URL to a separate EMPTY disposable PostgreSQL database.");
function identity(url: string) { const parsed = new URL(url); return `${parsed.hostname}:${parsed.port || "5432"}${parsed.pathname}`; }
let appUrl: string | undefined;
try { appUrl = parse(await readFile(path.resolve(directory, "../../../../.env.local"))).DATABASE_URL; } catch { /* env file optional */ }
if ([appUrl, process.env.DATABASE_URL].some(url => url && identity(url) === identity(testUrl))) throw new Error("Refusing the application database. Supply a different disposable database.");
const bootstrap = postgres(testUrl, { max: 1, prepare: false, connect_timeout: 10, onnotice: () => {} });
let appClient: { end: () => Promise<void> } | undefined;
let checks = 0;
function assert(condition: unknown, label: string): asserts condition { if (!condition) throw new Error(label); checks++; }
async function rejected(operation: () => Promise<unknown>, label: string) { let denied = false; try { await operation(); } catch { denied = true; } assert(denied, label); }
function first<T>(rows: readonly T[]): T { const row = rows[0]; if (!row) throw new Error("Fixture unavailable"); return row; }
try {
  const count = first(await bootstrap`SELECT count(*)::int AS count FROM information_schema.tables WHERE table_schema='public'`).count;
  if (count !== 0) throw new Error("Test database is not empty. Use a fresh disposable database.");
  const journal = JSON.parse(await readFile(path.resolve(directory, "../../drizzle/meta/_journal.json"), "utf8")) as { entries: { tag: string }[] };
  await bootstrap.begin(async tx => {
    for (const entry of journal.entries) {
      const migration = await readFile(path.resolve(directory, `../../drizzle/${entry.tag}.sql`), "utf8");
      for (const statement of migration.split("--> statement-breakpoint")) if (statement.trim()) await tx.unsafe(statement);
    }
  });
  checks++;
  // Override only this child process after proving it is a separate test database.
  process.env.DATABASE_URL = testUrl;
  const { db, client } = await import("../client"); appClient = client;
  const { users, roles, userRoles, practiceAttempts } = await import("../schema");
  const { seedQuestionBankRBAC } = await import("../seeds/question-bank-rbac");
  const bank = await import("./index");
  const { getPracticeAttempt, deletePracticeAttempt } = await import("../repositories/practice-attempts");
  const [author, reviewer, student] = await db.insert(users).values([
    { name: "Acceptance Author", email: "qb-author@example.test" },
    { name: "Acceptance Reviewer", email: "qb-reviewer@example.test" },
    { name: "Acceptance Student", email: "qb-student@example.test" },
  ]).returning({ id: users.id });
  if (!author || !reviewer || !student) throw new Error("Account fixtures failed");
  await seedQuestionBankRBAC(); await seedQuestionBankRBAC();
  const authorRole = first(await db.select().from(roles).where(eq(roles.key, "question_author")));
  const reviewerRole = first(await db.select().from(roles).where(eq(roles.key, "question_reviewer")));
  await db.insert(userRoles).values([{ userId: author.id, roleId: authorRole.id }, { userId: reviewer.id, roleId: reviewerRole.id }, { userId: author.id, roleId: reviewerRole.id }]);
  const content = { exam: "Both", topic: "Math", difficulty: "foundation", prompt: "What is the sum of two and three?", choices: ["4", "5"], correct: 1, explanation: "Adding two and three gives a total of five.", source: "Original acceptance fixture question." };
  await rejected(() => bank.createQuestionDraft(student.id, { slug: "unauthorized", content }), "Student must not author questions");
  const revision = await bank.createQuestionDraft(author.id, { slug: "acceptance-math", content });
  await rejected(() => bank.transitionQuestionRevision(reviewer.id, revision.id, "publish", "Checked every answer choice"), "Draft must not publish directly");
  await bank.transitionQuestionRevision(author.id, revision.id, "submit", "");
  await rejected(() => bank.transitionQuestionRevision(author.id, revision.id, "publish", "Checked every answer choice"), "Author must not self-review");
  await bank.transitionQuestionRevision(reviewer.id, revision.id, "publish", "Checked content, answer and provenance");
  assert((await bank.listQuestionRevisions(reviewer.id, { status: "published" })).total === 1, "Published list must contain the approved revision");
  await rejected(() => bank.listQuestionRevisions(student.id), "Student must not read editorial drafts");
  const session = await bank.startQuestionPractice(student.id, "SAT", "Math");
  assert(session.questions.length === 1 && !JSON.stringify(session).includes('"correct"') && !JSON.stringify(session).includes('"explanation"'), "Student session must omit answer keys");
  await rejected(() => bank.startQuestionPractice(student.id, "SAT"), "Only one open session is allowed");
  await bank.saveQuestionPracticeDraft(student.id, session.id, [{ questionId: revision.id, choice: 1 }]);
  assert((await bank.resumeQuestionPractice(student.id))?.answers[0]?.choice === 1, "Draft answers must resume");
  const replacement = await bank.createQuestionDraft(author.id, { entryId: revision.entryId, content: { ...content, correct: 0, explanation: "This revised test fixture uses a different answer key." } });
  await bank.transitionQuestionRevision(author.id, replacement.id, "submit", "");
  await bank.transitionQuestionRevision(reviewer.id, replacement.id, "publish", "Verified the changed answer key and content");
  assert((await bank.getQuestionRevision(reviewer.id, revision.id))?.revision.status === "retired", "Older revision must retire atomically");
  const [saved, repeated] = await Promise.all([
    bank.submitQuestionPractice(student.id, session.id, [{ questionId: revision.id, choice: 1 }]),
    bank.submitQuestionPractice(student.id, session.id, [{ questionId: revision.id, choice: 1 }]),
  ]);
  assert(saved && repeated && saved.id === repeated.id && saved.percentage === 100, "Concurrent retries must return the same correctly graded result");
  assert((await db.select().from(practiceAttempts).where(eq(practiceAttempts.userId, student.id))).length === 1, "Retry must not create duplicate attempts");
  const history = await getPracticeAttempt(student.id, saved.id);
  assert(history?.questionSnapshots[0]?.version === 1 && history.questionSnapshots[0].correct === 1, "History must preserve the original revision and answer key");
  assert(await getPracticeAttempt(author.id, saved.id) === null, "Other users must not read private attempts");
  await deletePracticeAttempt(student.id, saved.id);
  await rejected(() => bank.submitQuestionPractice(student.id, session.id, []), "Deleted result must not be recreated by replay");
  const next = await bank.startQuestionPractice(student.id, "SAT");
  assert(next.questions[0]?.version === 2, "New sessions must select the new published revision");
  await rejected(() => bank.submitQuestionPractice(author.id, next.id, []), "Cross-account submission must fail");
  await bank.abandonQuestionPractice(author.id, next.id);
  assert((await bank.resumeQuestionPractice(student.id))?.id === next.id, "Cross-account abandonment must not delete the student session");
  await db.update(users).set({ isActive: false }).where(eq(users.id, student.id));
  await rejected(() => bank.submitQuestionPractice(student.id, next.id, []), "Inactive users must be denied");
  await db.update(users).set({ isActive: true }).where(eq(users.id, student.id));
  await bank.abandonQuestionPractice(student.id, next.id);
  assert(await bank.resumeQuestionPractice(student.id) === null, "Student can abandon their open session");
  const imported = await bank.importQuestionDrafts(author.id, [{ slug: "starter-fixture", content }]);
  const skipped = await bank.importQuestionDrafts(author.id, [{ slug: "starter-fixture", content }]);
  assert(imported.imported === 1 && skipped.skipped === 1, "Starter import must be idempotent");
  console.log(`PostgreSQL repository workflow passed: ${checks} checks. Test fixtures remain only in the disposable test database.`);
} catch (error) {
  console.error("Disposable PostgreSQL workflow failed:", error instanceof Error ? error.message : "Unknown error"); process.exitCode = 1;
} finally { if (appClient) await appClient.end(); await bootstrap.end(); }
