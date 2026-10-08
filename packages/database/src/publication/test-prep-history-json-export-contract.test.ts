import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const route = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/export-json/route.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");
const repo = readFileSync(new URL("../repositories/test-prep-history.ts", import.meta.url), "utf8");

describe("saved exam history JSON export", () => {
  it("requires a signed-in owner and prevents shared caching", () => {
    expect(route).toContain("await auth()");
    expect(route).toContain("getStudentTestPrepExport(userId, query)");
    expect(route).toContain('status: 401');
    expect(route).toContain('"Cache-Control": "private, no-store"');
    expect(route).not.toContain("dangerouslySetInnerHTML");
  });
  it("reuses normalized search/date/exam/sort filters and bounded export", () => {
    expect(route).toContain("normalizeTestPrepHistoryQuery");
    for (const key of ['params.get("exam")', 'params.get("q")', 'params.get("sort")', 'params.get("from")', 'params.get("to")']) expect(route).toContain(key);
    expect(repo).toContain(".limit(TEST_PREP_EXPORT_LIMIT)");
    expect(repo).toContain("eq(studentCalculatorResults.userId, userId)");
    expect(route).toContain('schemaVersion: 1');
    expect(route).toContain("exportedCount: rows.length");
  });
  it("serves a downloadable JSON document without leaking database ids", () => {
    expect(route).toContain('"Content-Type": "application/json; charset=utf-8"');
    expect(route).toContain('educationplatform-exam-results.json');
    expect(route).toContain('"X-Content-Type-Options": "nosniff"');
    expect(route).not.toContain("row.id");
    expect(page).toContain("Export filtered JSON");
    expect(page).toContain("/dashboard/test-prep/export-json?${filterParams.toString()}");
  });
});
