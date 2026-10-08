import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../../..");
const source = (path: string) => readFileSync(resolve(root, path), "utf8");
const repository = source("packages/database/src/repositories/study-goal-export.ts");
const csvRoute = source("apps/web/src/app/dashboard/study-plan/export-csv/route.ts");
const jsonRoute = source("apps/web/src/app/dashboard/study-plan/export-json/route.ts");
const format = source("apps/web/src/app/dashboard/study-plan/export-format.ts");
const page = source("apps/web/src/app/dashboard/study-plan/page.tsx");

describe("study goal CSV and JSON export", () => {
  it("scopes the bounded query to the authenticated owner without mutating goals", () => {
    expect(repository).toContain("eq(studyGoals.userId, userId)");
    expect(repository).toContain(".limit(1000)");
    expect(repository).toContain("Authenticated user required");
    expect(repository).not.toMatch(/db\.(update|delete|insert)/);
  });
  it("rejects anonymous downloads and prevents response caching", () => {
    for (const route of [csvRoute, jsonRoute]) {
      expect(route).toContain("await auth()");
      expect(route).toContain("status: 401");
      expect(route).toContain('"Cache-Control": "private, no-store"');
      expect(route).toContain("getStudyGoalExport(userId)");
      expect(route).toContain('"X-Content-Type-Options": "nosniff"');
    }
  });
  it("neutralizes CSV formulas and provides a versioned JSON representation", () => {
    expect(format).toContain("safeStudyGoalCsvCell");
    expect(format).toContain("schemaVersion: 1");
    expect(format).toContain('exportType: "study-goals"');
    expect(format).toContain("isArchived");
    expect(format).toContain("createdAtUtc");
    expect(format).not.toContain("userId:");
  });
  it("exposes both downloads in the existing themed study-plan dashboard", () => {
    expect(page).toContain("/dashboard/study-plan/export-csv");
    expect(page).toContain("/dashboard/study-plan/export-json");
    expect(page).toContain("Back up your study goals");
  });
});
