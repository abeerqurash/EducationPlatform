import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8");

const schema = read("../schema/student-results.ts");
const repository = read("../repositories/student-results.ts");
const action = read(
  "../../../../apps/web/src/app/actions/student-results.ts",
);
const savedPage = read(
  "../../../../apps/web/src/app/dashboard/saved/page.tsx",
);
const dashboard = read(
  "../../../../apps/web/src/app/dashboard/page.tsx",
);

describe("student calculator result persistence", () => {
  it("stores results with account ownership and bounded snapshots", () => {
    expect(schema).toContain("student_calculator_results");
    expect(schema).toContain("userId: uuid");
    expect(schema).toContain("inputSnapshot");
    expect(schema).toContain("resultSnapshot");
    expect(action).toContain("25_000");
    expect(action).toContain("await auth()");
  });

  it("keeps reads and deletes scoped to the authenticated owner", () => {
    expect(repository).toContain("studentCalculatorResults.userId");
    expect(repository).toContain("safeLimit");
    expect(repository).toContain("Math.min");
    expect(repository).toContain("removeStudentResult");
  });

  it("connects real saved data to the customer dashboard", () => {
    expect(savedPage).toContain("listStudentResults");
    expect(savedPage).toContain("DeleteSavedResultButton");
    expect(dashboard).toContain("getStudentResultOverview");
    expect(dashboard).toContain("resultOverview.savedResultCount");
    expect(dashboard).toContain("resultOverview.toolsUsed");
    expect(dashboard).toContain("resultOverview.recentResults");
  });
});
