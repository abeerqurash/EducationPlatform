import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/page.tsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("../../../../apps/web/src/components/app-shell/dashboard-shell.tsx", import.meta.url), "utf8");

describe("customer dashboard UI foundation", () => {
  it("keeps the customer dashboard authenticated", () => {
    expect(page).toContain("const session = await auth()");
    expect(page).toContain('redirect("/login")');
  });

  it("uses the reusable dashboard shell", () => {
    expect(page).toContain("<DashboardShell");
    expect(shell).toContain('aria-label="Student dashboard"');
    expect(shell).toContain('href="#dashboard-main"');
  });

  it("provides the planned customer navigation foundation", () => {
    for (const label of ["Overview", "My tools", "Test prep", "Study plan", "Progress", "Saved results"]) {
      expect(shell).toContain(label);
    }
  });
});
