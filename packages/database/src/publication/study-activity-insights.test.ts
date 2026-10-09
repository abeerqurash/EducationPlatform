import { describe, expect, it } from "vitest";
import { summarizeStudyActivities } from "../../../../apps/web/src/components/dashboard/study-activity-insights";
import type { StudyActivityRow } from "../../../../apps/web/src/components/dashboard/study-activity-filter";
const sample: StudyActivityRow[] = [
  { id: "a", title: "Reading", activityType: "study_session", durationMinutes: 45, createdAt: "2026-10-08T09:00:00Z", manual: true },
  { id: "b", title: "Math", activityType: "study_session", durationMinutes: 35, createdAt: "2026-10-08T12:00:00Z", manual: true },
  { id: "c", title: "GPA", activityType: "calculator", durationMinutes: 10, createdAt: "2026-10-09T12:00:00Z", manual: false },
];
describe("filtered activity insights", () => {
  it("handles empty rows", () => expect(summarizeStudyActivities([])).toMatchObject({ count: 0, totalMinutes: 0, averageMinutes: 0, activeDays: 0, busiestDay: null }));
  it("totals and classifies activities", () => expect(summarizeStudyActivities(sample)).toMatchObject({ count: 3, totalMinutes: 90, sessions: 2, calculators: 1 }));
  it("rounds average minutes", () => expect(summarizeStudyActivities(sample).averageMinutes).toBe(30));
  it("selects busiest UTC day", () => expect(summarizeStudyActivities(sample)).toMatchObject({ activeDays: 2, busiestDay: "2026-10-08", busiestDayMinutes: 80 }));
  it("identifies longest activity", () => expect(summarizeStudyActivities(sample)).toMatchObject({ longestTitle: "Reading", longestMinutes: 45 }));
  it("does not mutate source", () => { const before = JSON.stringify(sample); summarizeStudyActivities(sample); expect(JSON.stringify(sample)).toBe(before); });
  it("uses only supplied filtered rows", () => expect(summarizeStudyActivities(sample.slice(2))).toMatchObject({ count: 1, totalMinutes: 10, sessions: 0, calculators: 1 }));
  it("ignores invalid dates for active days", () => expect(summarizeStudyActivities([{ ...sample[0], createdAt: "invalid" }]).activeDays).toBe(0));
  it("clamps negative and non-finite minutes", () => expect(summarizeStudyActivities([{ ...sample[0], durationMinutes: -20 }, { ...sample[1], durationMinutes: NaN }]).totalMinutes).toBe(0));
});
