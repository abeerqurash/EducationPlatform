import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { normalizeTestPrepHistoryQuery, normalizeTestPrepSearch, escapeTestPrepLike, TEST_PREP_SEARCH_MAX_LENGTH } from "../repositories/test-prep-history";
const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("saved exam result keyword search", () => {
  it("normalizes and bounds untrusted keywords", () => {
    expect(normalizeTestPrepSearch("  SAT    practice  ")).toBe("SAT practice");
    expect(normalizeTestPrepSearch(null)).toBe("");
    expect(normalizeTestPrepSearch("x".repeat(200)).length).toBe(TEST_PREP_SEARCH_MAX_LENGTH);
    expect(normalizeTestPrepHistoryQuery({ q: "  ACT  " }).q).toBe("ACT");
  });
  it("searches only owner-scoped saved results and treats SQL wildcards literally", () => {
    const repo = read("../repositories/test-prep-history.ts");
    expect(repo).toContain("eq(studentCalculatorResults.userId, userId)");
    expect(repo).toContain("eq(studentCalculatorResults.isSaved, true)");
    expect(repo).toContain("ilike(studentCalculatorResults.toolName");
    expect(repo).toContain("ilike(studentCalculatorResults.summary");
    expect(repo).toContain("escapeTestPrepLike(query.q)");
    expect(escapeTestPrepLike("50%_\\")).toBe("50\\%\\_\\\\");
  });
  it("preserves search across filters, pagination and export", () => {
    const page = read("../../../../apps/web/src/app/dashboard/test-prep/page.tsx");
    const dates = read("../../../../apps/web/src/components/shared/themed-date-range.tsx");
    const route = read("../../../../apps/web/src/app/dashboard/test-prep/export/route.ts");
    expect(page).toContain('aria-label="Search saved exam results"');
    expect(page).toContain('filterParams.set("q", history.q)');
    expect(page).toContain('withoutFilter(["q"])');
    expect(page).toContain('q={history.q}');
    expect(dates).toContain('if(q)p.set("q",q)');
    expect(route).toContain('q: url.searchParams.get("q")');
  });
});
