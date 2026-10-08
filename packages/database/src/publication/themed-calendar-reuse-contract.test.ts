import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const read = (path: string) => readFileSync(new URL(`../../../../apps/web/src/${path}`, import.meta.url), "utf8");
describe("calendar and dashboard filter reuse", () => {
  it("shares the same pill component for exam, date presets and sorting", () => {
    const page = read("app/dashboard/test-prep/page.tsx");
    expect(page.match(/<ThemedFilterPill/g)?.length).toBe(4);
    expect(read("components/shared/themed-filter-pill.tsx")).toContain('aria-current={active ? "page" : undefined}');
  });
  it("validates actual calendar days and supports keyboard dismissal", () => {
    const picker = read("components/shared/themed-date-range.tsx");
    expect(picker).toContain("parsed.getUTCDate() === day");
    expect(picker).toContain('e.key === "Escape"');
    expect(picker).toContain('aria-haspopup="dialog"');
  });
  it("keeps study goal date forms on the themed picker", () => {
    const study = read("app/dashboard/study-plan/page.tsx");
    const workspace = read("components/dashboard/study-goal-workspace.tsx");
    expect(study.match(/<ThemedFormDate/g)?.length).toBe(1);
    expect(workspace.match(/<ThemedFormDate/g)?.length).toBe(1);
    expect(read("components/shared/themed-form-date.tsx")).toContain('type="hidden" name={name}');
  });
});
