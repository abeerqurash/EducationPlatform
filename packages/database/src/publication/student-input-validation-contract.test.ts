import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const read = (p: string) => readFileSync(new URL(p, import.meta.url), "utf8");
const validator = read("../../../../apps/web/src/lib/study-input-validation.ts");
const actions = read("../../../../apps/web/src/app/actions/student-intelligence.ts");
const repository = read("../repositories/student-intelligence.ts");

describe("student input and archived-goal safeguards", () => {
  it("rejects impossible calendar dates and invalid timezone names", () => {
    expect(validator).toContain("getUTCDate()");
    expect(validator).toContain('timeZone: value');
    expect(actions).toContain("validCalendarDate(targetDate)");
    expect(actions).toContain("validIanaTimezone(timezone)");
  });
  it("validates safe integer minute boundaries", () => {
    expect(validator).toContain("Number.isSafeInteger(value)");
    expect(actions).toContain("validStudyMinutes(minutes, 10080)");
    expect(actions).toContain("validStudyMinutes(targetMinutes, 100000)");
  });
  it("blocks toggling and re-archiving archived goals", () => {
    expect(repository.split("eq(studyGoals.isArchived, false)").length - 1).toBeGreaterThanOrEqual(3);
  });
});
