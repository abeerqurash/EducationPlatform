import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const repository = readFileSync(
  new URL("../repositories/student-intelligence.ts", import.meta.url), "utf8",
);
const page = readFileSync(
  new URL("../../../../apps/web/src/app/dashboard/progress/page.tsx", import.meta.url), "utf8",
);

describe("student progress aggregate integrity", () => {
  it("computes study minutes and activity count in SQL rather than a truncated list", () => {
    expect(repository).toContain("coalesce(sum(");
    expect(repository).toContain("count(*)::int");
    expect(repository).toContain("activities: recent");
    expect(repository).toContain(".limit(100)");
    expect(repository).not.toContain("recent.reduce(");
  });

  it("computes completed goals independently of the 20-goal workspace preview", () => {
    expect(repository).toContain("getStudyGoalSummary");
    expect(repository).toContain("filter (where");
    expect(page).toContain("getStudyGoalSummary(userId)");
    expect(page).toContain("goalSummary.completedGoals");
    expect(page).not.toContain("workspace.goals.filter(");
  });

  it("exposes accessible progress semantics and the untruncated activity count", () => {
    expect(page).toContain('role="progressbar"');
    expect(page).toContain("aria-valuenow");
    expect(page).toContain("aria-valuetext");
    expect(page).toContain("progress.activityCount");
  });
});
