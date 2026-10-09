import { describe, expect, it } from "vitest";
import { buildStudyActionPlan } from "../../../../apps/web/src/app/dashboard/progress/study-action-plan";
import { buildWeeklyStudySchedule, formatWeeklyStudyScheduleText, weeklyStudyScheduleFilename, WEEK_DAYS } from "../../../../apps/web/src/app/dashboard/progress/study-weekly-schedule";

const plan = buildStudyActionPlan([]);
describe("weekly study schedule", () => {
  it("preserves weekday ordering", () => expect(buildWeeklyStudySchedule(plan, ["Friday", "Monday"], 30).entries.map(x => x.day)).toEqual(["Monday", "Friday"]));
  it("deduplicates chosen days", () => expect(buildWeeklyStudySchedule(plan, ["Monday", "Monday"], 30).scheduledDays).toBe(1));
  it("supports all seven days", () => expect(buildWeeklyStudySchedule(plan, WEEK_DAYS, 30).scheduledDays).toBe(7));
  it("computes planned minutes", () => expect(buildWeeklyStudySchedule(plan, ["Monday", "Tuesday"], 45).scheduledMinutes).toBe(90));
  it("has no sessions when no days selected", () => expect(buildWeeklyStudySchedule(plan, [], 30).entries).toEqual([]));
  it("uses a safe fallback for NaN", () => expect(buildWeeklyStudySchedule(plan, ["Monday"], NaN).scheduledMinutes).toBe(30));
  it("uses a safe fallback for negative duration", () => expect(buildWeeklyStudySchedule(plan, ["Monday"], -5).scheduledMinutes).toBe(30));
  it("caps unreasonable durations", () => expect(buildWeeklyStudySchedule(plan, ["Monday"], 9999).scheduledMinutes).toBe(720));
  it("rounds fractional durations down", () => expect(buildWeeklyStudySchedule(plan, ["Monday"], 25.9).scheduledMinutes).toBe(25));
  it("keeps action plan benchmark", () => expect(buildWeeklyStudySchedule(buildStudyActionPlan([], 60), ["Monday"], 30).benchmarkMinutes).toBe(60));
  it("includes a recommended action", () => expect(buildWeeklyStudySchedule(plan, ["Monday"], 30).entries[0].action.length).toBeGreaterThan(5));
  it("falls back if no actions are selected", () => expect(buildWeeklyStudySchedule(buildStudyActionPlan([], 30, []), ["Monday"], 30).entries[0].action).toContain("learning goals"));
  it("does not claim planned minutes are recorded", () => expect(buildWeeklyStudySchedule(plan, ["Monday"], 30).note).toContain("not recorded"));
  it("formats an empty schedule", () => expect(formatWeeklyStudyScheduleText(buildWeeklyStudySchedule(plan, [], 30))).toContain("No days selected"));
  it("formats a nonempty schedule", () => expect(formatWeeklyStudyScheduleText(buildWeeklyStudySchedule(plan, ["Tuesday"], 60))).toContain("Tuesday: 60 minutes"));
  it("produces deterministic filenames", () => { expect(weeklyStudyScheduleFilename("txt")).toBe("weekly-study-schedule.txt"); expect(weeklyStudyScheduleFilename("json")).toBe("weekly-study-schedule.json"); });
});
