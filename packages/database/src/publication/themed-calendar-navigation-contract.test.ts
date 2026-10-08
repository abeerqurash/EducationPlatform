import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const picker = readFileSync(new URL("../../../../apps/web/src/components/shared/themed-date-range.tsx", import.meta.url), "utf8");
describe("shared themed calendar navigation", () => {
  it("supports month and year navigation without native browser date controls", () => {
    expect(picker).toContain('<CalendarDropdown label="Month"');
    expect(picker).toContain('<CalendarDropdown label="Year"');
    expect(picker).toContain('option.value >= 1 && option.value <= 9999');
    expect(picker).not.toContain("<select");
    expect(picker).toContain('aria-haspopup="listbox"');
    expect(picker).toContain('aria-selected={value === option.value}');
  });
  it("uses UTC today for history filters and restores focus after selecting", () => {
    expect(picker).toContain('now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()');
    expect(picker).toContain('trigger.current?.focus()');
  });
  it("retains strict date validation and accessible calendar labeling", () => {
    expect(picker).toContain('parsed.getUTCDate() === day');
    expect(picker).toContain('aria-haspopup="dialog"');
    expect(picker).toContain('aria-labelledby={headingId}');
  });
});
