import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const repository = readFileSync(new URL("../repositories/student-intelligence.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/progress/page.tsx", import.meta.url), "utf8");
describe("study progress calendar window and accessibility", () => {
  it("excludes future-dated activities from all five weekly and monthly queries", () => {
    expect(repository).toContain("until.setUTCDate(until.getUTCDate() + 1)");
    expect(repository.split("lt(studyActivities.createdAt, until)").length - 1).toBe(5);
  });
  it("exposes every bar as a labeled accessible graphic", () => {
    expect(page).toContain('role="group" aria-label="Daily recorded study minutes"');
    expect(page).toContain('role="img" aria-label={`${day.day}: ${day.minutes} recorded minutes across ${day.count} activities`}');
  });
});

describe("study progress SQL grouping integrity", () => {
  it("selects the exact UTC date expression used by grouping and ordering", () => {
    expect(repository).toContain("day: sql<string>`(date(${studyActivities.createdAt} at time zone 'UTC'))::text`");
    expect(repository).toContain(".groupBy(sql`date(${studyActivities.createdAt} at time zone 'UTC')`)");
    expect(repository).not.toContain("to_char(${studyActivities.createdAt}");
  });
});
