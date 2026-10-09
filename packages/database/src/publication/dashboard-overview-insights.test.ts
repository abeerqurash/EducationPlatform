import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { summarizeOverviewActivity } from "../../../../apps/web/src/app/dashboard/overview-insights";

const day = (date: string, count = 1, minutes = 30) => ({ day: date, count, minutes });

describe("dashboard overview real activity insights", () => {
  it("handles empty activity", () => expect(summarizeOverviewActivity([], "2026-10-10")).toEqual({ streak: 0, activeDays: 0, minutes: 0 }));
  it("counts a streak including today", () => expect(summarizeOverviewActivity([day("2026-10-09"), day("2026-10-10")], "2026-10-10").streak).toBe(2));
  it("allows yesterday as the most recent day", () => expect(summarizeOverviewActivity([day("2026-10-08"), day("2026-10-09")], "2026-10-10").streak).toBe(2));
  it("does not claim a stale streak", () => expect(summarizeOverviewActivity([day("2026-10-07")], "2026-10-10").streak).toBe(0));
  it("ignores inactive days for streaks", () => expect(summarizeOverviewActivity([day("2026-10-08"), day("2026-10-09", 0, 0), day("2026-10-10")], "2026-10-10").streak).toBe(1));
  it("sums activity minutes", () => expect(summarizeOverviewActivity([day("2026-10-09", 2, 90), day("2026-10-10", 1, 25)], "2026-10-10").minutes).toBe(115));
  it("uses the shared themed panel action link", () => {
    const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/page.tsx", import.meta.url), "utf8");
    const action = readFileSync(new URL("../../../../apps/web/src/components/app-shell/panel-action-link.tsx", import.meta.url), "utf8");
    expect(page).toContain('<PanelActionLink href="/tools">View all tools');
    expect(action).toContain("focus-visible:outline");
    expect(action).toContain("rounded-full");
    expect(page).toContain("getStudyProgress(session.user.id)");
    expect(page).not.toContain('label="Study streak" value="0 days"');
  });
});
