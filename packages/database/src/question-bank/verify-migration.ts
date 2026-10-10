/** Optional real PostgreSQL acceptance; all fixtures and DDL are rolled back. */
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import postgres from "postgres";

const directory = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(directory, "../../../../.env.local"), quiet: true });
const testUrl = process.env.QUESTION_BANK_TEST_DATABASE_URL;
if (!testUrl) throw new Error("Set QUESTION_BANK_TEST_DATABASE_URL to a separate disposable PostgreSQL database.");
function identity(url: string) { const parsed = new URL(url); return `${parsed.hostname}:${parsed.port || "5432"}${parsed.pathname}`; }
if (process.env.DATABASE_URL && identity(testUrl) === identity(process.env.DATABASE_URL)) throw new Error("Refusing to run against the application database. Use a separate test database.");
const connection = postgres(testUrl, { max: 1, prepare: false, connect_timeout: 10 });
const schema = `qb_verify_${randomUUID().replaceAll("-", "")}`;
const success = new Error("ROLLBACK_SUCCESS");
let checks = 0;
try {
  await connection.begin(async tx => {
    await tx.unsafe(`CREATE SCHEMA "${schema}"`);
    await tx.unsafe(`SET LOCAL search_path TO "${schema}"`);
    await tx.unsafe('CREATE TABLE users (id uuid PRIMARY KEY)');
    await tx.unsafe(await readFile(path.resolve(directory, "../../drizzle/0005_practice_attempts.sql"), "utf8"));
    const migration = await readFile(path.resolve(directory, "../../drizzle/0006_question_bank.sql"), "utf8");
    for (const statement of migration.split("--> statement-breakpoint")) if (statement.trim()) await tx.unsafe(statement);
    const author = randomUUID(), reviewer = randomUUID(), entry = randomUUID(), first = randomUUID(), second = randomUUID();
    await tx`INSERT INTO users (id) VALUES (${author}), (${reviewer})`;
    await tx`INSERT INTO question_entries (id,slug) VALUES (${entry},'verify-math')`;
    const content = { exam: "Both", topic: "Math", difficulty: "foundation", prompt: "What is two plus three?", choices: ["4", "5"], correct: 1, explanation: "Two plus three is five.", source: "Original test fixture question." };
    async function rejected(label: string, operation: () => Promise<unknown>) {
      let rejected = false;
      try { await tx.savepoint(operation); } catch (error) {
        const code = (error as { code?: string }).code;
        if (!["23505", "23514", "P0001"].includes(code ?? "")) throw error;
        rejected = true;
      }
      if (!rejected) throw new Error(`Expected database rejection: ${label}`);
      checks++;
    }
    await tx`INSERT INTO question_revisions (id,entry_id,version,content,author_user_id) VALUES (${first},${entry},1,${tx.json(content)},${author})`;
    await rejected("immutable content", () => tx`UPDATE question_revisions SET content = ${tx.json({ ...content, correct: 0 })} WHERE id = ${first}`);
    await rejected("draft directly published", () => tx`UPDATE question_revisions SET status='published', reviewer_user_id=${reviewer}, reviewed_at=now(), review_note='Checked all answer choices' WHERE id=${first}`);
    await tx`UPDATE question_revisions SET status='in_review' WHERE id=${first}`;
    await rejected("self-review", () => tx`UPDATE question_revisions SET status='published', reviewer_user_id=${author}, reviewed_at=now(), review_note='Checked all answer choices' WHERE id=${first}`);
    await tx`UPDATE question_revisions SET status='published', reviewer_user_id=${reviewer}, reviewed_at=now(), review_note='Checked all answer choices' WHERE id=${first}`;
    await rejected("revision deletion", () => tx`DELETE FROM question_revisions WHERE id=${first}`);
    await rejected("duplicate version", () => tx`INSERT INTO question_revisions (entry_id,version,content,author_user_id) VALUES (${entry},1,${tx.json(content)},${author})`);
    await tx`INSERT INTO question_revisions (id,entry_id,version,content,author_user_id) VALUES (${second},${entry},2,${tx.json(content)},${author})`;
    await tx`UPDATE question_revisions SET status='in_review' WHERE id=${second}`;
    await rejected("two current published revisions", () => tx`UPDATE question_revisions SET status='published', reviewer_user_id=${reviewer}, reviewed_at=now(), review_note='Checked the second version' WHERE id=${second}`);
    await tx`UPDATE question_revisions SET status='retired' WHERE id=${first}`;
    await tx`UPDATE question_revisions SET status='published', reviewer_user_id=${reviewer}, reviewed_at=now(), review_note='Checked the second version' WHERE id=${second}`;
    const versions = await tx`SELECT status,version FROM question_revisions ORDER BY version`;
    if (versions[0]?.status !== "retired" || versions[1]?.status !== "published") throw new Error("Version replacement failed");
    checks++;
    const [attempt] = await tx`INSERT INTO practice_attempts (user_id,exam,total,answered,correct,incorrect,unanswered,percentage,duration_seconds,question_ids,answers,topic_breakdown,question_snapshots) VALUES (${author},'SAT',1,1,1,0,0,100,30,${tx.json([first])},${tx.json([{questionId:first,choice:1}])},'[]',${tx.json([{...content,id:first,entryId:entry,version:1}])}) RETURNING id`;
    if (!attempt) throw new Error("Attempt fixture failed");
    const [savedSession] = await tx`INSERT INTO question_practice_sessions (user_id,exam,revision_ids,expires_at,submitted_at,submitted_attempt_id) VALUES (${author},'SAT',${tx.json([first])},now()+interval '4 hours',now(),${attempt.id}) RETURNING id`;
    if (!savedSession) throw new Error("Session fixture failed");
    await tx`DELETE FROM practice_attempts WHERE id=${attempt.id}`;
    const [deletedResultSession] = await tx`SELECT submitted_at,submitted_attempt_id FROM question_practice_sessions WHERE id=${savedSession.id}`;
    if (!deletedResultSession?.submitted_at || deletedResultSession.submitted_attempt_id !== null) throw new Error("Deleted-result replay marker lost");
    checks++;
    throw success; // postgres.js rolls back the schema, migration and fixtures.
  });
} catch (error) {
  if (error === success) console.log(`PostgreSQL migration acceptance passed: ${checks} checks; fixtures and schema rolled back.`);
  else { console.error("PostgreSQL acceptance failed. No fixture changes were committed."); process.exitCode = 1; }
} finally { await connection.end(); }
