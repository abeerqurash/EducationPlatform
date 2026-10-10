import { client } from "../client";
import { seedQuestionBankRBAC } from "./question-bank-rbac";
try {
  console.log(await seedQuestionBankRBAC());
} catch {
  console.error("Question-bank role seed failed. Check database connectivity and migrations.");
  process.exitCode = 1;
} finally { await client.end(); }
