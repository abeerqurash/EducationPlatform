import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { normalizeTestPrepHistoryQuery } from "../repositories/test-prep-history";
const repo = readFileSync(new URL("../repositories/test-prep-history.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");
const dateRange = readFileSync(new URL("../../../../apps/web/src/components/shared/themed-date-range.tsx", import.meta.url), "utf8");
const exportRoute = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/export/route.ts", import.meta.url), "utf8");
describe("saved exam history sort contract", () => {
  it("normalizes untrusted sorting inputs", () => {
    expect(normalizeTestPrepHistoryQuery({ sort: "oldest" }).sort).toBe("oldest");
    expect(normalizeTestPrepHistoryQuery({ sort: "random" }).sort).toBe("newest");
    expect(normalizeTestPrepHistoryQuery({}).sort).toBe("newest");
  });
  it("uses stable server-side ordering with ownership restrictions", () => {
    expect(repo).toContain('query.sort === "oldest" ? asc : desc');
    expect(repo).toContain('order(studentCalculatorResults.createdAt), order(studentCalculatorResults.id)');
    expect(repo).toContain('eq(studentCalculatorResults.userId, userId)');
  });
  it("preserves order in filters, date navigation and CSV exports", () => {
    expect(page).toContain('aria-label="Sort saved exam results"');
    expect(page).toContain('sort: history.sort');
    expect(page).toContain('sort={history.sort}');
    expect(dateRange).toContain('new URLSearchParams({exam,sort,page:"1"})');
    expect(exportRoute).toContain('sort: url.searchParams.get("sort")');
  });
});
