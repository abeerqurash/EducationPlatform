import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const repo = readFileSync(new URL("../repositories/student-intelligence.ts", import.meta.url), "utf8");
const actions = readFileSync(new URL("../../../../apps/web/src/app/actions/student-intelligence.ts", import.meta.url), "utf8");
const progress = readFileSync(new URL("../../../../apps/web/src/app/dashboard/progress/page.tsx", import.meta.url), "utf8");
const plan = readFileSync(new URL("../../../../apps/web/src/app/dashboard/study-plan/page.tsx", import.meta.url), "utf8");
describe("student history ownership boundaries", () => {
  it("deletes only owned manual study sessions, not calculator events", () => {
    expect(repo).toContain('eq(studyActivities.activityType, "study_session")');
    expect(repo).toContain("sql`${studyActivities.metadata} ->> 'source' = 'manual_study_log'`");
    expect(repo).toContain("eq(studyActivities.userId, userId)");
    expect(actions).toContain("!id || !UUID.test(activityId)");
    expect(progress).toContain("action={deleteManualStudySessionAction}");
  });
  it("restores only owned archived goals", () => {
    expect(repo).toContain("eq(studyGoals.isArchived, true)");
    expect(repo).toContain("eq(studyGoals.userId, userId)");
    expect(actions).toContain("!id || !UUID.test(goalId)");
    expect(plan).toContain("action={restoreStudyGoalAction}");
  });
});
