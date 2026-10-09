import { describe, expect, it } from "vitest";
import { buildWeeklyStudySchedule, normalizeDayMinutes } from "../../../../apps/web/src/app/dashboard/progress/study-weekly-schedule";
import type { StudyActionPlan } from "../../../../apps/web/src/app/dashboard/progress/study-action-plan";

const plan = { benchmarkMinutes: 30, actions: [], version: 1 } as unknown as StudyActionPlan;

describe("custom daily study durations", () => {
  it("uses the default when no override is given", () => {
    const schedule = buildWeeklyStudySchedule(plan, ["Monday", "Wednesday"], 30);
    expect(schedule.entries.map(item => item.minutes)).toEqual([30, 30]);
    expect(schedule.scheduledMinutes).toBe(60);
  });
  it("applies independent overrides to selected days", () => {
    const schedule = buildWeeklyStudySchedule(plan, ["Monday", "Wednesday", "Friday"], 30, { Monday: 60, Friday: 45 });
    expect(schedule.entries.map(item => item.minutes)).toEqual([60, 30, 45]);
    expect(schedule.scheduledMinutes).toBe(135);
  });
  it("ignores overrides for unselected days", () => {
    expect(buildWeeklyStudySchedule(plan, ["Monday"], 30, { Tuesday: 120 }).scheduledMinutes).toBe(30);
  });
  it("falls back on non-finite and negative overrides", () => {
    expect(normalizeDayMinutes(NaN, 30)).toBe(30);
    expect(normalizeDayMinutes(Infinity, 30)).toBe(30);
    expect(normalizeDayMinutes(-1, 30)).toBe(30);
  });
  it("caps extreme overrides and floors fractional values", () => {
    expect(normalizeDayMinutes(9000, 30)).toBe(720);
    expect(normalizeDayMinutes(32.9, 30)).toBe(32);
    expect(normalizeDayMinutes(1, 30)).toBe(5);
  });
  it("keeps empty schedules empty", () => {
    const schedule = buildWeeklyStudySchedule(plan, [], 30, { Monday: 120 });
    expect(schedule.entries).toEqual([]);
    expect(schedule.scheduledMinutes).toBe(0);
  });
});
