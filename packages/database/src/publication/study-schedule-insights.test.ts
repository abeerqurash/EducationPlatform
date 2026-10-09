import { describe, expect, it } from "vitest";
import { summarizeWeeklySchedule, formatWeeklyScheduleInsightsText } from "../../../../apps/web/src/app/dashboard/progress/study-schedule-insights";
import type { WeeklyStudySchedule } from "../../../../apps/web/src/app/dashboard/progress/study-weekly-schedule";
const make = (entries: WeeklyStudySchedule["entries"]): WeeklyStudySchedule => ({ version: 1, benchmarkMinutes: 30, scheduledMinutes: entries.reduce((n, x) => n + x.minutes, 0), scheduledDays: entries.length, entries, note: "Planned only" });
describe("weekly schedule review", () => {
  it("handles no study days", () => { const x = summarizeWeeklySchedule(make([])); expect(x.totalHours).toBe(0); expect(x.restDays).toHaveLength(7); expect(x.longestRestStreak).toBe(7); });
  it("calculates totals from customized durations", () => { const x = summarizeWeeklySchedule(make([{day:"Monday",minutes:60,action:"A"},{day:"Wednesday",minutes:30,action:"B"},{day:"Friday",minutes:45,action:"C"}])); expect(x.totalHours).toBe(2.25); expect(x.averageMinutes).toBe(45); expect(x.longestSession).toBe(60); expect(x.shortestSession).toBe(30); });
  it("calculates consecutive days without wrapping Sunday to Monday", () => { const x = summarizeWeeklySchedule(make([{day:"Monday",minutes:30,action:""},{day:"Tuesday",minutes:30,action:""},{day:"Sunday",minutes:30,action:""}])); expect(x.longestStudyStreak).toBe(2); expect(x.longestRestStreak).toBe(4); });
  it("reports all-day schedules without rest", () => { const x = summarizeWeeklySchedule(make(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => ({day:day as WeeklyStudySchedule["entries"][number]["day"],minutes:30,action:""})))); expect(x.restDays).toEqual([]); expect(x.longestStudyStreak).toBe(7); expect(x.notices.join(" ")).toContain("rest day"); });
  it("warns about sessions exceeding three hours", () => { const x = summarizeWeeklySchedule(make([{day:"Saturday",minutes:240,action:""}])); expect(x.notices.join(" ")).toContain("three hours"); });
  it("warns about large duration variation", () => { const x = summarizeWeeklySchedule(make([{day:"Monday",minutes:30,action:""},{day:"Friday",minutes:120,action:""}])); expect(x.notices.join(" ")).toContain("vary"); });
  it("does not treat absent days as completed", () => { const x = summarizeWeeklySchedule(make([{day:"Thursday",minutes:20,action:""}])); expect(x.dailyShare.filter(d => d.minutes > 0)).toHaveLength(1); expect(x.restDays).toHaveLength(6); });
  it("keeps percentages in the expected range", () => { const x = summarizeWeeklySchedule(make([{day:"Monday",minutes:20,action:""},{day:"Friday",minutes:80,action:""}])); expect(x.dailyShare.find(d => d.day === "Friday")?.percent).toBe(80); });
  it("exports clear planned-only text", () => { const t = formatWeeklyScheduleInsightsText(summarizeWeeklySchedule(make([]))); expect(t).toContain("Planned schedule only"); expect(t).toContain("Rest days:"); });
});
