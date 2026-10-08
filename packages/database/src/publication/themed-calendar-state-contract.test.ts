import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");
const picker = readFileSync(new URL("../../../../apps/web/src/components/shared/themed-date-range.tsx", import.meta.url), "utf8");

describe("calendar navigation state and accessibility", () => {
  it("resets the date editor when applied URL filters change", () => {
    expect(page).toContain('key={`${history.exam}:${history.sort}:${history.pageSize}:${history.from ?? ""}:${history.to ?? ""}:${history.q}`}');
  });
  it("gives each calendar dialog a unique React-generated heading ID", () => {
    expect(picker).toContain("const headingId = useId();");
    expect(picker).toContain("aria-labelledby={headingId}");
  });
  it("focuses the selected month or year and keeps Escape inside the dropdown", () => {
    expect(picker).toContain('`${optionPrefix}-option-${currentIndex}`');
    expect(picker).toContain('scrollIntoView({ block: "nearest" })');
    expect(picker).toContain("event.stopPropagation()");
  });
});
