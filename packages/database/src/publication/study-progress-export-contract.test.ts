import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const web = resolve(process.cwd(), "../../apps/web/src/app/dashboard/progress");
const source = (path: string) => readFileSync(resolve(web, path), "utf8");

describe("30-day study progress export", () => {
  it("uses authenticated account-scoped live aggregates for both formats", () => {
    for (const format of ["csv", "json"]) {
      const route = source(`export-${format}/route.ts`);
      expect(route).toContain("await auth()");
      expect(route).toContain("getStudyMonthlyTrend(userId)");
      expect(route).toContain('"Cache-Control": "private, no-store"');
      expect(route).toContain('"X-Content-Type-Options": "nosniff"');
    }
  });
  it("exports UTC days and aggregate totals without account identifiers", () => {
    const format = source("export-format.ts");
    expect(format).toContain('timezone: "UTC"');
    expect(format).toContain("periodStart:");
    expect(format).toContain("totalMinutes");
    expect(format).not.toContain("userId");
  });
  it("uses safe CSV cells and includes zero-activity days", () => {
    const format = source("export-format.ts");
    expect(format).toContain("csvCell");
    expect(format).toContain("progress.daily.map");
    expect(format).toContain('replace(/"/g,');
  });
  it("exposes both export actions in the dashboard", () => {
    const page = source("page.tsx");
    expect(page).toContain('/dashboard/progress/export-csv');
    expect(page).toContain('/dashboard/progress/export-json');
  });
});
