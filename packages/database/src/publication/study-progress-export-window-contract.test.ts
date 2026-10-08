import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const base = resolve(process.cwd(), "../../apps/web/src/app/dashboard/progress");
const read = (file: string) => readFileSync(resolve(base, file), "utf8");
describe("bounded study progress export periods", () => {
  it("accepts only 7, 30 and 90 days and defaults to 30", () => {
    const source = read("export-window.ts");
    expect(source).toContain('value === "7"');
    expect(source).toContain('value === "90"');
    expect(source).toContain('value === "90" ? 90 : 30');
  });
  it("uses the same selector for all formats", () => {
    const page = read("page.tsx");
    for (const days of ["7", "30", "90"]) expect(page).toContain(`value: "${days}"`);
    expect(page).toContain("<ThemedExportSelect");
    for (const format of ["csv", "json", "text"]) expect(page).toContain(`formAction="/dashboard/progress/export-${format}"`);
  });
  it("authorizes every export and applies the bounded period", () => {
    for (const format of ["csv", "json", "text"]) {
      const route = read(`export-${format}/route.ts`);
      expect(route).toContain("await auth()");
      expect(route).toContain("parseProgressExportDays");
      expect(route).toContain("getStudyProgressExportWindow(userId, days)");
      expect(route).toContain('"Cache-Control": "private, no-store"');
    }
  });
});
