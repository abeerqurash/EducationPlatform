import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { historyResultRange } from "../../../../apps/web/src/components/shared/history-page-window";

const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");

describe("test prep history visible range and endpoint navigation", () => {
  it("computes correct one-based result bounds", () => {
    expect(historyResultRange(1, 15, 34)).toEqual({ start: 1, end: 15 });
    expect(historyResultRange(2, 15, 34)).toEqual({ start: 16, end: 30 });
    expect(historyResultRange(3, 15, 34)).toEqual({ start: 31, end: 34 });
    expect(historyResultRange(1, 30, 34)).toEqual({ start: 1, end: 30 });
    expect(historyResultRange(2, 30, 34)).toEqual({ start: 31, end: 34 });
    expect(historyResultRange(1, 15, 0)).toEqual({ start: 0, end: 0 });
  });
  it("clamps untrusted and out-of-range values", () => {
    expect(historyResultRange(1000, 15, 34)).toEqual({ start: 31, end: 34 });
    expect(historyResultRange(-1, -1, 34)).toEqual({ start: 1, end: 15 });
    expect(historyResultRange(Number.NaN, 99999, 34)).toEqual({ start: 1, end: 34 });
    expect(historyResultRange(1, 15, -1)).toEqual({ start: 0, end: 0 });
  });
  it("uses the existing filter-preserving URL builder for first and last navigation", () => {
    expect(page).toContain("historyResultRange(history.page, history.pageSize, history.total)");
    expect(page).toContain("href={historyUrl(1)}");
    expect(page).toContain("href={historyUrl(history.totalPages)}");
    expect(page).toContain("Showing ${visibleRange.start}–${visibleRange.end}");
  });
});
