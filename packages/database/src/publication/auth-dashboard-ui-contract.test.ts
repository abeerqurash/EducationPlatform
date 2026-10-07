import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8");

const authLayout = read(
  "../../../../apps/web/src/app/(auth)/layout.tsx",
);
const authCss = read(
  "../../../../apps/web/src/app/(auth)/auth-workspace.css",
);
const dashboard = read(
  "../../../../apps/web/src/app/dashboard/page.tsx",
);
const admin = read(
  "../../../../apps/web/src/app/admin/page.tsx",
);

describe("auth and application visual language", () => {
  it("gives existing auth pages a route-scoped branded layout", () => {
    expect(authLayout).toContain("auth-workspace");
    expect(authLayout).toContain("{children}");
    expect(authCss).toContain('.auth-workspace__card button[type="submit"]');
  });

  it("uses the public site's pill-shaped primary language in generated dashboards", () => {
    expect(dashboard).toContain("rounded-full");
    expect(admin).toContain("rounded-full");
    expect(dashboard).toContain("bg-[#151a12]");
    expect(admin).toContain("bg-[#151a12]");
  });
});
