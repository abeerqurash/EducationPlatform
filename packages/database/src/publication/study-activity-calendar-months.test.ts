import { describe, expect, it } from "vitest";
import { groupActivityMonths, moveCalendarSelection } from "../../../../apps/web/src/app/dashboard/progress/calendar-months";
const records = [{ day: "2026-10-01", minutes: 30, activities: 2 }, { day: "2026-09-30", minutes: 0, activities: 0 }, { day: "2026-10-02", minutes: 60, activities: 1 }];
describe("calendar monthly insights", () => {
  it("groups in UTC month order", () => expect(groupActivityMonths(records).map(x => x.key)).toEqual(["2026-09", "2026-10"]));
  it("calculates monthly totals", () => expect(groupActivityMonths(records)[1]).toMatchObject({ minutes: 90, activities: 3, activeDays: 2, coverage: 100 }));
  it("keeps zero days", () => expect(groupActivityMonths(records)[0].activeDays).toBe(0));
  it("handles empty lists", () => expect(groupActivityMonths([])).toEqual([]));
  it("ignores malformed date strings", () => expect(groupActivityMonths([{ day: "bad", minutes: 1, activities: 1 }])).toEqual([]));
  it("normalizes invalid amounts", () => expect(groupActivityMonths([{ day: "2026-10-01", minutes: -1, activities: NaN }])[0].minutes).toBe(0));
  it("does not mutate source", () => { groupActivityMonths(records); expect(records[0].day).toBe("2026-10-01"); });
  it("moves between dates", () => expect(moveCalendarSelection(records, "2026-09-30", 1)).toBe("2026-10-01"));
  it("clamps navigation", () => expect(moveCalendarSelection(records, "2026-10-02", 1)).toBe("2026-10-02"));
  it("handles empty selection", () => expect(moveCalendarSelection([], null, 1)).toBeNull());
});
