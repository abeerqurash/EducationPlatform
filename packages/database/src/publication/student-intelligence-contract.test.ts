import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8");

const schema = read("../schema/student-intelligence.ts");
const repository = read("../repositories/student-intelligence.ts");
const actions = read("../../../../apps/web/src/app/actions/student-intelligence.ts");
const resultActions = read("../../../../apps/web/src/app/actions/student-results.ts");
const plan = read("../../../../apps/web/src/app/dashboard/study-plan/page.tsx");
const goalWorkspace = read("../../../../apps/web/src/components/dashboard/study-goal-workspace.tsx");
const progress = read("../../../../apps/web/src/app/dashboard/progress/page.tsx");
const settings = read("../../../../apps/web/src/app/dashboard/settings/page.tsx");

describe("student intelligence workspace", () => {
  it("owns profiles goals and activities by user", () => {
    expect(schema).toContain("student_profiles");
    expect(schema).toContain("study_goals");
    expect(schema).toContain("study_activities");
    expect(repository).toContain("studyGoals.userId");
    expect(repository).toContain("studyActivities.userId");
  });

  it("keeps mutations authenticated and ownership scoped", () => {
    expect(actions).toContain("await auth()");
    expect(actions).toContain("UUID.test");
    expect(repository).toContain("eq(studyGoals.userId, userId)");
  });

  it("promotes study plan progress and settings from placeholders", () => {
    expect(plan).toContain("createStudyGoalAction");
    expect(plan).toContain("<StudyGoalWorkspace");
    expect(goalWorkspace).toContain("<StudyGoalControls");
    expect(progress).toContain("getStudyProgress");
    expect(progress).toContain("getStudentResultOverview");
    expect(settings).toContain("saveStudentProfileAction");
  });

  it("records saved calculator results as real study activity", () => {
    expect(resultActions).toContain("recordStudyActivity");
    expect(resultActions).toContain('"calculator_result_saved"');
    expect(resultActions).toContain('revalidatePath("/dashboard/progress")');
  });

  it("keeps direct form actions compatible with React server-form action typing", () => {
    expect(actions).not.toContain('return { ok: false, message: "Sign in required." }');
    expect(actions).not.toContain('return { ok: true, message: "Goal created." }');
    expect(actions).not.toContain('return { ok: true, message: "Settings saved." }');
  });
});
