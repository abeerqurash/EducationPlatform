import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (file: string) => readFileSync(resolve(process.cwd(), "../../apps/web/src/app/dashboard/progress", file), "utf8");

describe("bounded progress dashboard insights", () => {
  it("uses the same validated range parser as exports", () => {
    const page = read("page.tsx");
    expect(page).toContain("parseProgressExportDays");
    expect(page).toContain("getStudyProgressExportWindow(userId, trendDays)");
    expect(page).toContain('name="trendDays"');
  });
  it("keeps the established custom dropdown UI", () => {
    const page = read("page.tsx");
    expect(page).toContain("<ThemedExportSelect");
    expect(page).not.toContain("<select");
  });
  it("reports zero-inclusive averages and accessible daily activity", () => {
    const page = read("page.tsx");
    expect(page).toContain("trend.totalMinutes / trendDays");
    expect(page).toContain("trend.daily.map");
    expect(page).toContain('role="listitem"');
    expect(page).toContain("No recorded activity");
  });
  it("preserves existing monthly chart, recording and export actions", () => {
    const page = read("page.tsx");
    expect(page).toContain("getStudyMonthlyTrend(userId)");
    expect(page).toContain("recordStudySessionAction");
    for (const format of ["csv", "json", "text"]) expect(page).toContain(`export-${format}`);
  });
});
