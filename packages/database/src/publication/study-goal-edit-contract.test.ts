import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const repository = read("../repositories/student-intelligence.ts");
const actions = read("../../../../apps/web/src/app/actions/student-intelligence.ts");
const page = read("../../../../apps/web/src/app/dashboard/study-plan/page.tsx");
const workspace = read("../../../../apps/web/src/components/dashboard/study-goal-workspace.tsx");
describe("owned study goal edits", () => {
  it("enforces ownership and non-archived state in the update query", () => {
    const update = repository.split("export async function updateStudyGoal")[1].split("export async function setStudyGoalCompleted")[0];
    expect(update).toContain("eq(studyGoals.userId, input.userId)");
    expect(update).toContain("eq(studyGoals.isArchived, false)");
  });
  it("validates edits server-side and refreshes the two affected dashboards", () => {
    expect(actions).toContain("export async function updateStudyGoalAction");
    expect(actions).toContain("validCalendarDate(targetDate)");
    expect(actions).toContain("validStudyMinutes(targetMinutes, 100000)");
    expect(actions).toContain('revalidatePath("/dashboard/progress")');
  });
  it("provides an accessible inline edit form with existing values", () => {
    expect(page).toContain("<StudyGoalWorkspace");
    expect(workspace).toContain("<details");
    expect(workspace).toContain("Edit goal");
    expect(workspace).toContain("action={updateStudyGoalAction}");
    expect(workspace).toContain("defaultValue={goal.title}");
  });
});
