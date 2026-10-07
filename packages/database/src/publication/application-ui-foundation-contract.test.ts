import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8");

const admin = read(
  "../../../../apps/web/src/components/app-shell/admin-shell.tsx",
);
const authShell = read(
  "../../../../apps/web/src/components/app-shell/auth-shell.tsx",
);
const adminPage = read(
  "../../../../apps/web/src/app/admin/page.tsx",
);
const queue = read(
  "../../../../apps/web/src/app/admin/publication/page.tsx",
);
const detail = read(
  "../../../../apps/web/src/app/admin/publication/[toolId]/page.tsx",
);

describe("application UI foundation", () => {
  it("provides reusable admin and authentication shells", () => {
    expect(admin).toContain("export function AdminShell");
    expect(authShell).toContain("export function AuthShell");
    expect(admin).toContain('href="#admin-main"');
  });

  it("keeps the admin overview behind the shared protected workspace boundary", () => {
    expect(adminPage).toContain("requireAdminWorkspaceAccess");
    expect(adminPage).toContain(
      'requireAdminWorkspaceAccess("/admin")',
    );
    expect(adminPage).toContain("<AdminShell");
  });

  it("places publication list and detail inside the shared admin shell", () => {
    expect(queue).toContain('<AdminShell active="Publication">');
    expect(detail).toContain('<AdminShell active="Publication">');
    expect(queue).toContain("AdminPublicationPageContent");
    expect(detail).toContain("AdminPublicationDetailPageContent");
  });
});
