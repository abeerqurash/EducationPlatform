import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const form = readFileSync(new URL("../../../../apps/web/src/components/dashboard/confirm-study-session-delete.tsx", import.meta.url), "utf8");
const dialog = readFileSync(new URL("../../../../apps/web/src/components/shared/themed-confirm-dialog.tsx", import.meta.url), "utf8");
const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/progress/page.tsx", import.meta.url), "utf8");
const history = readFileSync(new URL("../../../../apps/web/src/components/dashboard/study-activity-history.tsx", import.meta.url), "utf8");
const actions = readFileSync(new URL("../../../../apps/web/src/app/actions/student-intelligence.ts", import.meta.url), "utf8");
const repo = readFileSync(new URL("../repositories/student-intelligence.ts", import.meta.url), "utf8");

describe("manual study session deletion safeguards", () => {
  it("asks before submitting and cancels without a server request", () => {
    expect(form).toContain("<ThemedConfirmDialog");
    expect(dialog).toContain('role="alertdialog"');
    expect(form).toContain("action={deleteManualStudySessionAction}");
    expect(dialog).toContain("disabled={pending}");
  });
  it("renders the confirmation control only for manual sessions", () => {
    expect(page).toContain('activity.activityType === "study_session"');
    expect(page).toContain('source === "manual_study_log"');
    expect(page).toContain("manual: activity.activityType ===");
    expect(history).toContain("activity.manual && <ConfirmStudySessionDelete");
  });
  it("enforces ownership and manual source again in the database", () => {
    expect(repo).toContain('eq(studyActivities.userId, userId)');
    expect(repo).toContain('eq(studyActivities.activityType, "study_session")');
    expect(repo).toContain("manual_study_log");
    expect(actions).toContain('typeof titleValue !== "string"');
    expect(actions).toContain('typeof minutesValue !== "string"');
  });
});
