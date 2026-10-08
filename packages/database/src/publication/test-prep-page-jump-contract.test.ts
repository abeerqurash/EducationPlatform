import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { normalizeTestPrepHistoryQuery } from "../repositories/test-prep-history";

const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");

describe("test prep history direct page navigation", () => {
  it("offers an accessible GET form only when there are multiple pages", () => {
    expect(page).toContain('history.totalPages > 1 ? (');
    expect(page).toContain('method="get" aria-label="Jump to saved result page"');
    expect(page).toContain('name="page" type="number"');
    expect(page).toContain('max={history.totalPages} step={1} required');
    expect(page).toContain('htmlFor="history-jump-page"');
  });
  it("preserves validated filters and size during direct navigation", () => {
    for (const name of ["exam", "sort", "size", "from", "to"]) {
      expect(page).toContain(`name="${name}"`);
    }
    expect(page).toContain('action="/dashboard/test-prep"');
    expect(normalizeTestPrepHistoryQuery({ page: "-100" }).page).toBe(1);
    expect(normalizeTestPrepHistoryQuery({ page: "99999" }).page).toBe(1000);
    expect(normalizeTestPrepHistoryQuery({ page: "100000" }).page).toBe(1);
  });
});
