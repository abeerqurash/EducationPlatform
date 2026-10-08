import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { normalizeTestPrepHistoryQuery, TEST_PREP_PAGE_SIZE } from "../repositories/test-prep-history";
const repo = readFileSync(new URL("../repositories/test-prep-history.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");
describe("test prep history pagination and filtering", () => {
  it("bounds untrusted URL inputs", () => {
    expect(normalizeTestPrepHistoryQuery({ exam: "act", page: "3" })).toEqual({ exam: "act", page: 3 });
    expect(normalizeTestPrepHistoryQuery({ exam: "invalid", page: "-5" })).toEqual({ exam: "all", page: 1 });
    expect(normalizeTestPrepHistoryQuery({ page: "99999" }).page).toBe(1000);
    expect(normalizeTestPrepHistoryQuery({ page: "1 OR 1=1" }).page).toBe(1);
    expect(TEST_PREP_PAGE_SIZE).toBe(15);
  });
  it("keeps every count and page restricted to the owner and saved exam results", () => {
    expect(repo).toContain("eq(studentCalculatorResults.userId, userId)");
    expect(repo).toContain("eq(studentCalculatorResults.isSaved, true)");
    expect(repo).toContain(".limit(TEST_PREP_PAGE_SIZE).offset((page - 1) * TEST_PREP_PAGE_SIZE)");
    expect(page).toContain("getStudentTestPrepHistory(userId, query)");
    expect(page).toContain('aria-label="Filter saved exam results"');
    expect(page).toContain('aria-label="Exam result history pages"');
  });
});
