import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { activeTestPrepDatePreset, getTestPrepDatePreset } from "../repositories/test-prep-date-presets";

const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");
const filterPill = readFileSync(new URL("../../../../apps/web/src/components/shared/themed-filter-pill.tsx", import.meta.url), "utf8");

describe("UTC test-prep date presets", () => {
  const now = new Date("2026-03-01T00:05:00.000Z");
  it("includes today and correctly spans month and leap-year boundaries", () => {
    expect(getTestPrepDatePreset("7d", now)).toEqual({ from: "2026-02-23", to: "2026-03-01" });
    expect(getTestPrepDatePreset("30d", now)).toEqual({ from: "2026-01-31", to: "2026-03-01" });
    expect(getTestPrepDatePreset("90d", now)).toEqual({ from: "2025-12-02", to: "2026-03-01" });
    expect(getTestPrepDatePreset("7d", new Date("2024-03-01T18:00:00Z")).from).toBe("2024-02-24");
  });
  it("detects only exact preset windows", () => {
    const range = getTestPrepDatePreset("30d", now);
    expect(activeTestPrepDatePreset(range.from, range.to, now)).toBe("30d");
    expect(activeTestPrepDatePreset("2026-01-01", range.to, now)).toBeNull();
  });
  it("preserves exam selection and resets pagination for preset navigation", () => {
    expect(page).toContain('aria-label="Quick date ranges"');
    expect(page).toContain('exam: history.exam, ...getTestPrepDatePreset(preset), page: "1"');
    expect(page).toContain('active={activePreset === preset}');
    expect(filterPill).toContain('aria-current={active ? "page" : undefined}');
  });
});
