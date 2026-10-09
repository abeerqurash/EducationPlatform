import { describe, expect, it } from "vitest";
import { compareScheduleWithHistory, formatScheduleRealityCsv, formatScheduleRealityText } from "../../../../apps/web/src/app/dashboard/progress/study-schedule-reality";
import type { WeeklyStudySchedule } from "../../../../apps/web/src/app/dashboard/progress/study-weekly-schedule";
const schedule: WeeklyStudySchedule = { version: 1, benchmarkMinutes: 30, scheduledMinutes: 90, scheduledDays: 2, entries: [{ day: "Monday", minutes: 60, action: "Study" }, { day: "Wednesday", minutes: 30, action: "Review" }], note: "Planned" };
describe("planned versus recorded study comparison", () => {
  it("keeps plans separate from recorded history", () => { const x = compareScheduleWithHistory(schedule, []); expect(x.recordedMinutes).toBe(0); expect(x.plannedWeeklyMinutes).toBe(90); });
  it("groups history by UTC weekday", () => { const x = compareScheduleWithHistory(schedule, [{ day: "2026-10-05", minutes: 45 }, { day: "2026-10-07", minutes: 20 }]); expect(x.daily[0].recordedMinutes).toBe(45); expect(x.daily[2].recordedMinutes).toBe(20); });
  it("normalizes weekly totals by observed days", () => { const x = compareScheduleWithHistory(schedule, [{ day: "2026-10-05", minutes: 70 }, { day: "2026-10-06", minutes: 0 }, { day: "2026-10-07", minutes: 0 }, { day: "2026-10-08", minutes: 0 }, { day: "2026-10-09", minutes: 0 }, { day: "2026-10-10", minutes: 0 }, { day: "2026-10-11", minutes: 0 }]); expect(x.recordedWeeklyAverage).toBe(70); });
  it("does not count duplicate dates twice", () => { const x = compareScheduleWithHistory(schedule, [{ day: "2026-10-05", minutes: 30 }, { day: "2026-10-05", minutes: 40 }]); expect(x.recordedMinutes).toBe(30); expect(x.observedDays).toBe(1); });
  it("rejects invalid calendar dates", () => { expect(compareScheduleWithHistory(schedule, [{ day: "2026-02-30", minutes: 50 }]).observedDays).toBe(0); });
  it("ignores negative and non-finite activity", () => { expect(compareScheduleWithHistory(schedule, [{ day: "2026-10-05", minutes: -10 }, { day: "2026-10-06", minutes: Infinity }]).recordedMinutes).toBe(0); });
  it("computes weekday averages from observations", () => { const x = compareScheduleWithHistory(schedule, [{ day: "2026-10-05", minutes: 30 }, { day: "2026-10-12", minutes: 60 }]); expect(x.daily[0].recordedWeeklyAverage).toBe(45); });
  it("exports plain text", () => { expect(formatScheduleRealityText(compareScheduleWithHistory(schedule, []))).toContain("not recorded"); });
  it("exports CSV", () => { expect(formatScheduleRealityCsv(compareScheduleWithHistory(schedule, []))).toContain("Monday,60,0,0,0"); });
  it("recomputes totals from schedule entries", () => { expect(compareScheduleWithHistory({ ...schedule, scheduledMinutes: 1 }, []).plannedWeeklyMinutes).toBe(90); });
});
