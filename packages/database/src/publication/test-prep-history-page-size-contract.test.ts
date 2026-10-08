import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { normalizeTestPrepHistoryQuery, TEST_PREP_PAGE_SIZE, TEST_PREP_PAGE_SIZES } from "../repositories/test-prep-history";
const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("bounded saved exam result page sizes", () => {
  it("allows only the approved page sizes", () => {
    expect(TEST_PREP_PAGE_SIZE).toBe(15);
    expect(TEST_PREP_PAGE_SIZES).toEqual([15, 30, 50]);
    for (const [input, expected] of [["15", 15], ["30", 30], ["50", 50], ["999", 15], ["-1", 15], ["30;drop", 15]] as const) {
      expect(normalizeTestPrepHistoryQuery({ size: input }).pageSize).toBe(expected);
    }
  });
  it("uses a bounded owner-scoped SQL page without altering the export limit", () => {
    const repo = read("../repositories/test-prep-history.ts");
    expect(repo).toContain("eq(studentCalculatorResults.userId, userId)");
    expect(repo).toContain(".limit(query.pageSize).offset((page - 1) * query.pageSize)");
    expect(repo).toContain(".limit(TEST_PREP_EXPORT_LIMIT)");
  });
  it("preserves the size across presets, custom dates, pagination and exam selection", () => {
    const page = read("../../../../apps/web/src/app/dashboard/test-prep/page.tsx");
    const dateRange = read("../../../../apps/web/src/components/shared/themed-date-range.tsx");
    expect(page).toContain('aria-label="Results per page"');
    expect(page).toContain('size: String(history.pageSize)');
    expect(page).toContain('size={history.pageSize}');
    expect(page).toContain('historyUrl(pageNumber)');
    expect(dateRange).toContain('size:String(size)');
    expect(dateRange).toContain('size?: number; q?: string; from: string; to: string');
  });
});
