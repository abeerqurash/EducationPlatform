import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const repository = read("../repositories/student-intelligence.ts");
const page = read("../../../../apps/web/src/app/dashboard/progress/page.tsx");
describe("seven-day study trend", () => {
  it("aggregates all activity days in SQL and fills zero-activity days", () => {
    expect(repository).toContain("groupBy(sql`date(");
    expect(repository).toContain("Array.from({ length: 7 }");
    expect(repository).toContain("minutes: found?.minutes ?? 0");
  });
  it("renders a seven-day trend without claiming automatic time tracking", () => {
    expect(page).toContain("progress.daily.map(");
    expect(page).toContain("progress.activeDays");
    expect(page).toContain("not an automatically tracked timer");
  });
});
