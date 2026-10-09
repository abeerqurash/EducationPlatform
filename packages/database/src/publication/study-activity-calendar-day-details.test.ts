import { describe, expect, it } from "vitest";
import { activityDetailsForDay, summarizeCalendarDayDetails } from "../../../../apps/web/src/app/dashboard/progress/calendar-day-details";

const rows = [
  { id: "a", title: "SAT", activityType: "study_session", durationMinutes: 30, createdAt: "2026-10-09T23:59:59.000Z" },
  { id: "b", title: "Math", activityType: "calculator", durationMinutes: 0, createdAt: "2026-10-10T00:00:00.000Z" },
  { id: "c", title: "Reading", activityType: "study_session", durationMinutes: 20, createdAt: "2026-10-09T08:00:00.000Z" },
];

describe("calendar selected-day recent records", () => {
  it("uses UTC boundaries", () => expect(activityDetailsForDay(rows, "2026-10-09").map(x => x.id)).toEqual(["a", "c"]));
  it("excludes the following UTC date", () => expect(activityDetailsForDay(rows, "2026-10-10").map(x => x.id)).toEqual(["b"]));
  it("returns empty for an invalid date", () => expect(activityDetailsForDay(rows, "not-a-date")).toEqual([]));
  it("returns empty for missing activity", () => expect(activityDetailsForDay([], "2026-10-09")).toEqual([]));
  it("does not mutate input", () => { const copy = [...rows]; activityDetailsForDay(rows, "2026-10-09"); expect(rows).toEqual(copy); });
  it("summarizes sessions and calculator records", () => expect(summarizeCalendarDayDetails(rows)).toEqual({ count: 3, sessions: 2, calculators: 1, minutes: 50 }));
  it("normalizes invalid and negative minutes", () => expect(summarizeCalendarDayDetails([{...rows[0], durationMinutes: -1}, {...rows[1], durationMinutes: Number.NaN}]).minutes).toBe(0));
  it("handles empty summaries", () => expect(summarizeCalendarDayDetails([])).toEqual({count:0,sessions:0,calculators:0,minutes:0}));
});
