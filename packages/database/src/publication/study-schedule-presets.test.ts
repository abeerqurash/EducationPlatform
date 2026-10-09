import { describe, expect, it } from "vitest";
import { findStudySchedulePreset, STUDY_SCHEDULE_PRESETS, formatWeeklySchedulePrintableHtml } from "../../../../apps/web/src/app/dashboard/progress/study-schedule-presets";
import { buildWeeklyStudySchedule } from "../../../../apps/web/src/app/dashboard/progress/study-weekly-schedule";
import type { StudyActionPlan } from "../../../../apps/web/src/app/dashboard/progress/study-action-plan";
const plan = { benchmarkMinutes: 30, actions: [], version: 1 } as unknown as StudyActionPlan;
describe("weekly schedule templates and printable planner", () => {
  it("offers five distinct templates", () => expect(new Set(STUDY_SCHEDULE_PRESETS.map(p => p.id)).size).toBe(5));
  it("returns no template for an unknown identifier", () => expect(findStudySchedulePreset("unknown")).toBeUndefined());
  it("supports a weekday schedule", () => expect(findStudySchedulePreset("weekdays")?.days).toHaveLength(5));
  it("supports a daily habit", () => expect(findStudySchedulePreset("daily")?.days).toHaveLength(7));
  it("supports weekend-only sessions", () => expect(findStudySchedulePreset("weekend")?.days).toEqual(["Saturday", "Sunday"]));
  it("calculates balanced total", () => { const p = findStudySchedulePreset("balanced")!; expect(buildWeeklyStudySchedule(plan, p.days, p.minutes, p.overrides).scheduledMinutes).toBe(135); });
  it("calculates intensive total including Saturday override", () => { const p = findStudySchedulePreset("intensive")!; expect(buildWeeklyStudySchedule(plan, p.days, p.minutes, p.overrides).scheduledMinutes).toBe(270); });
  it("includes printable headings and totals", () => { const html = formatWeeklySchedulePrintableHtml(buildWeeklyStudySchedule(plan, ["Monday"], 30)); expect(html).toContain("Weekly Study Planner"); expect(html).toContain("30</strong> planned minutes"); });
  it("escapes dangerous content in printable output", () => { const schedule = buildWeeklyStudySchedule(plan, ["Monday"], 30); schedule.entries[0].action = `<script>alert('x')</script> & \"`; const html = formatWeeklySchedulePrintableHtml(schedule); expect(html).not.toContain("<script>"); expect(html).toContain("&lt;script&gt;"); expect(html).toContain("&amp;"); });
  it("renders an empty-state row", () => expect(formatWeeklySchedulePrintableHtml(buildWeeklyStudySchedule(plan, [], 30))).toContain("No study days selected"));
  it("identifies the plan as not completed", () => expect(formatWeeklySchedulePrintableHtml(buildWeeklyStudySchedule(plan, ["Friday"], 45))).toContain("not a record of completed study"));
  it("contains no external resources", () => { const html = formatWeeklySchedulePrintableHtml(buildWeeklyStudySchedule(plan, ["Friday"], 45)); expect(html).not.toMatch(/<script|<link|<iframe/i); });
});
