import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const repo = readFileSync(new URL("../repositories/test-prep.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");
const index = readFileSync(new URL("../index.ts", import.meta.url), "utf8");

describe("student test-prep workspace", () => {
  it("limits saved exam results by authenticated owner and saved state", () => {
    expect(repo).toContain("eq(studentCalculatorResults.userId, userId)");
    expect(repo).toContain("eq(studentCalculatorResults.isSaved, true)");
    expect(repo).toContain("(^|-)(sat|act)(-|$)");
    expect(repo).toContain(".limit(30)");
    expect(index).toContain('export * from "./repositories/test-prep"');
  });
  it("uses the server session and does not invent scores or practice sessions", () => {
    expect(page).toContain("const session = await auth()");
    expect(page).toContain("getStudentTestPrepOverview(userId)");
    expect(page).toContain("getStudentWorkspace(userId)");
    expect(page).toContain("Scores are not inferred from study time.");
    expect(page).toContain("history.rows.map");
  });
});
