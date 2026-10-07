import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8");

const chrome = read(
  "../../../../apps/web/src/components/layout/site-chrome.tsx",
);
const layout = read(
  "../../../../apps/web/src/app/layout.tsx",
);

describe("application chrome boundary", () => {
  it("keeps application and authentication routes standalone", () => {
    for (const route of [
      '"/admin"',
      '"/dashboard"',
      '"/login"',
      '"/register"',
    ]) {
      expect(chrome).toContain(route);
    }
  });

  it("preserves public header and footer through the route-aware chrome", () => {
    expect(chrome).toContain("<AnnouncementBar />");
    expect(chrome).toContain("<Header />");
    expect(chrome).toContain("<Footer />");
    expect(layout).toContain('<SiteChrome position="header" />');
    expect(layout).toContain('<SiteChrome position="footer" />');
  });
});
