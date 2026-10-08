import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { normalizeTestPrepHistoryQuery, TEST_PREP_EXPORT_LIMIT } from "../repositories/test-prep-history";
const repository = readFileSync(new URL("../repositories/test-prep-history.ts", import.meta.url), "utf8");
const route = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/export/route.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");
const dateRange = readFileSync(new URL("../../../../apps/web/src/components/shared/themed-date-range.tsx", import.meta.url), "utf8");

describe("exam history filtering and CSV export", () => {
  it("validates UTC date inputs and rejects reversed ranges", () => {
    expect(normalizeTestPrepHistoryQuery({ from: "2026-02-29", to: "2026-03-01" }).from).toBeUndefined();
    expect(normalizeTestPrepHistoryQuery({ from: "2024-02-29", to: "2024-03-01" }).from).toBe("2024-02-29");
    expect(normalizeTestPrepHistoryQuery({ from: "2026-10-08", to: "2026-10-01" }).from).toBeUndefined();
    expect(normalizeTestPrepHistoryQuery({ from: "2026-10-08", to: "2026-10-01" }).to).toBeUndefined();
  });
  it("exports only authenticated owner-scoped saved results with a hard cap", () => {
    expect(TEST_PREP_EXPORT_LIMIT).toBe(1000);
    expect(repository).toContain("eq(studentCalculatorResults.userId, userId)");
    expect(repository).toContain("eq(studentCalculatorResults.isSaved, true)");
    expect(repository).toContain(".limit(TEST_PREP_EXPORT_LIMIT)");
    expect(route).toContain("const session = await auth()");
    expect(route).toContain("getStudentTestPrepExport(userId, query)");
    expect(route).toContain('"Cache-Control": "private, no-store"');
    expect(route).toContain("text.replace(/\"/g, '\"\"')");
  });
  it("preserves filters across page navigation and exports", () => {
    expect(page).toContain("<ThemedDateRange");
    expect(dateRange).toContain('p.set("from",a)');
    expect(dateRange).toContain('p.set("to",b)');
    expect(dateRange).toContain("Apply dates");
    expect(dateRange).toContain("Clear dates");
    expect(page).toContain("historyUrl(history.page - 1)");
    expect(page).toContain("historyUrl(history.page + 1)");
    expect(page).toContain("/dashboard/test-prep/export?");
  });
});
