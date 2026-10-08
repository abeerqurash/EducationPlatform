import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");

describe("test prep active filter summary", () => {
  it("shows individual removable chips for exam, dates, sorting and page size", () => {
    expect(page).toContain('aria-label="Active history filters"');
    for (const key of ['key: "exam"', 'key: "dates"', 'key: "sort"', 'key: "size"']) {
      expect(page).toContain(key);
    }
    expect(page).toContain('aria-label={`Remove ${chip.label} filter`}');
  });
  it("retains other normalized filters while removing only selected keys", () => {
    expect(page).toContain('const next = new URLSearchParams(filterParams)');
    expect(page).toContain('for (const key of keys) next.delete(key)');
    expect(page).toContain('next.set("page", "1")');
    expect(page).toContain('withoutFilter(["from", "to"])');
  });
});
