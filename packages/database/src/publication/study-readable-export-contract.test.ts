import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "../../apps/web/src/app/dashboard");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("study exports in readable text", () => {
  for (const page of ["study-plan", "progress"] as const) {
    it(`${page} requires authentication and private, no-store download`, () => {
      const route = read(`${page}/export-text/route.ts`);
      expect(route).toContain("await auth()");
      expect(route).toContain("!session?.user || !userId");
      expect(route).toContain('"Cache-Control": "private, no-store"');
      expect(route).toContain('"X-Content-Type-Options": "nosniff"');
      expect(route).toContain('"Content-Type": "text/plain; charset=utf-8"');
    });
    it(`${page} has a dashboard download control and readable formatter`, () => {
      expect(read(`${page}/page.tsx`)).toContain(`href="/dashboard/${page}/export-text"`);
      const format = read(`${page}/export-format.ts`);
      expect(format).toContain(page === "progress" ? "formatProgressText" : "formatStudyGoalsText");
    });
  }
  it("progress export includes every daily record", () => {
    expect(read("progress/export-format.ts")).toContain("for (const day of progress.daily)");
  });
  it("study goals export includes archived status and target metadata", () => {
    const format = read("study-plan/export-format.ts");
    expect(format).toContain("goal.status");
    expect(format).toContain("goal.targetMinutes");
  });
});
