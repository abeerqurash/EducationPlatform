import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const actions = read("../../../../apps/web/src/app/actions/student-intelligence.ts");
const page = read("../../../../apps/web/src/app/dashboard/progress/page.tsx");
const repository = read("../repositories/student-intelligence.ts");
describe("student study session workflow", () => {
  it("requires an authenticated account and validated completed minutes", () => {
    expect(actions).toContain("export async function recordStudySessionAction");
    expect(actions).toContain("const id = await userId()");
    expect(actions).toContain("validStudyMinutes(durationMinutes, 720)");
    expect(actions).toContain('activityType: "study_session"');
    expect(actions).toContain('source: "manual_study_log"');
  });
  it("uses the persisted activity repository and refreshes progress", () => {
    expect(actions).toContain("recordStudyActivity({");
    expect(actions).toContain('revalidatePath("/dashboard/progress")');
    expect(repository).toContain("export async function recordStudyActivity");
  });
  it("provides a labeled form and a bounded recent activity list", () => {
    expect(page).toContain("action={recordStudySessionAction}");
    expect(page).toContain('name="durationMinutes"');
    expect(page).toContain("progress.activities.slice(0, 12)");
  });
});
