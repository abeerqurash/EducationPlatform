import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8");

const button = read(
  "../../../../apps/web/src/components/app-shell/site-button.tsx",
);
const dashboardShell = read(
  "../../../../apps/web/src/components/app-shell/dashboard-shell.tsx",
);
const adminShell = read(
  "../../../../apps/web/src/components/app-shell/admin-shell.tsx",
);

describe("shared application button interaction", () => {
  it("carries the frontend continuous shimmer and smooth hover motion", () => {
    expect(button).toContain("button-shimmer_4.8s");
    expect(button).toContain("cubic-bezier(0.16,1,0.3,1)");
    expect(button).toContain("hover:-translate-y-[3px]");
    expect(button).toContain("motion-reduce:before:animate-none");
  });

  it("supports background-aware frontend variants", () => {
    expect(button).toContain('"primary" | "secondary" | "light" | "ghost-light"');
    expect(button).toContain("bg-[#d8ff62]");
    expect(button).toContain("border-white/30");
    expect(button).toContain("!text-white [&_*]:!text-white");
  });

  it("is used by both application shells", () => {
    expect(dashboardShell).toContain("<SiteButton");
    expect(adminShell).toContain("<SiteButton");
  });
});
