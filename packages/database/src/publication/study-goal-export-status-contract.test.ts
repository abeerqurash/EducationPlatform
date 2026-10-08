import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../../..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const base = "apps/web/src/app/dashboard/study-plan";

describe("study goal export status filtering", () => {
  it("defines explicit statuses with safe fallback and mutually exclusive filters", () => {
    const filter = read(`${base}/export-filter.ts`);
    for (const status of ["all", "active", "completed", "archived"]) expect(filter).toContain(`"${status}"`);
    expect(filter).toContain('if (goal.isArchived) return false');
    expect(filter).toContain('Boolean(goal.completedAt)');
  });
  it("applies the identical filter in all three authenticated routes", () => {
    for (const type of ["csv", "json", "text"]) {
      const route = read(`${base}/export-${type}/route.ts`);
      expect(route).toContain('await auth()');
      expect(route).toContain('getStudyGoalExport(userId)');
      expect(route).toContain('filterStudyGoalExport(');
      expect(route).toContain('parseGoalExportStatus(new URL(request.url).searchParams.get("status"))');
      expect(route).toContain('"Cache-Control": "private, no-store"');
    }
  });
  it("shares a status selector across all three export actions", () => {
    const page = read(`${base}/page.tsx`);
    expect(page).toContain('name="status"');
    expect(page).toContain('<ThemedExportSelect');
    for (const type of ["csv", "json", "text"]) expect(page).toContain(`formAction="/dashboard/study-plan/export-${type}"`);
  });
});
