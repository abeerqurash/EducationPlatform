import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { historyPageWindow } from "../../../../apps/web/src/components/shared/history-page-window";

const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");

describe("test prep history page navigation", () => {
  it("centers a bounded page window at the beginning, middle and end", () => {
    expect(historyPageWindow(1, 20)).toEqual([1, 2, 3, 4, 5]);
    expect(historyPageWindow(10, 20)).toEqual([8, 9, 10, 11, 12]);
    expect(historyPageWindow(20, 20)).toEqual([16, 17, 18, 19, 20]);
    expect(historyPageWindow(1, 2)).toEqual([1, 2]);
  });
  it("clamps invalid input without allocating an unbounded window", () => {
    expect(historyPageWindow(-9, 0)).toEqual([1]);
    expect(historyPageWindow(9999, 100, 9999)).toEqual([92, 93, 94, 95, 96, 97, 98, 99, 100]);
    expect(historyPageWindow(Number.NaN, Number.POSITIVE_INFINITY)).toEqual([1]);
  });
  it("preserves query filters, marks the current page and provides a reset", () => {
    expect(page).toContain("historyPageWindow(history.page, history.totalPages)");
    expect(page).toContain("href={historyUrl(pageNumber)}");
    expect(page).toContain('aria-current={history.page === pageNumber ? "page" : undefined}');
    expect(page).toContain('href="/dashboard/test-prep"');
    expect(page).toContain("filtersActive ?");
  });
});
