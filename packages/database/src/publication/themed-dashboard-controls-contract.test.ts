import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");
const dates = readFileSync(new URL("../../../../apps/web/src/components/shared/themed-date-range.tsx", import.meta.url), "utf8");
const pills = readFileSync(new URL("../../../../apps/web/src/components/shared/themed-filter-pill.tsx", import.meta.url), "utf8");
const dialog = readFileSync(new URL("../../../../apps/web/src/components/shared/themed-confirm-dialog.tsx", import.meta.url), "utf8");
describe("shared themed dashboard controls", () => {
  it("uses consistent pill filters and custom date ranges", () => {
    expect(page).toContain("<ThemedDateRange");
    expect(page).toContain("<ThemedFilterPill");
    expect(pills).toContain("bg-[#171912] !text-white");
    expect(page).not.toContain('type="date"');
  });
  it("uses a custom calendar with apply and clear actions", () => {
    expect(dates).toContain('aria-label="Previous month"');
    expect(dates).toContain('aria-label="Next month"');
    expect(dates).toContain('Clear dates');
    expect(dates).toContain('Apply dates');
  });
  it("uses themed confirmations", () => {
    expect(dialog).toContain('role="alertdialog"');
    expect(dialog).toContain('aria-modal="true"');
    expect(dialog).not.toContain('window.confirm(');
  });
});
