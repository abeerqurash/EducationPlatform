import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../../../../apps/web/src/app/", import.meta.url);
const read = (path: string) =>
  readFileSync(new URL(path, root), "utf8");

describe("application workspace routes", () => {
  it("ships every customer dashboard navigation destination", () => {
    const sectionRoutes = [
      "../../../../apps/web/src/app/dashboard/test-prep/page.tsx",
    ];

    for (const route of sectionRoutes) {
      expect(existsSync(new URL(route, root))).toBe(true);
      expect(read(route)).toContain("DashboardSectionPage");
    }

    for (const route of [
      "../../../../apps/web/src/app/dashboard/study-plan/page.tsx",
      "../../../../apps/web/src/app/dashboard/progress/page.tsx",
      "../../../../apps/web/src/app/dashboard/settings/page.tsx",
    ]) {
      const page = read(route);
      expect(page).toContain("<DashboardShell");
    }

    const toolsRoute =
      "../../../../apps/web/src/app/dashboard/tools/page.tsx";

    expect(existsSync(new URL(toolsRoute, root))).toBe(true);

    const toolsPage = read(toolsRoute);

    expect(toolsPage).toContain("getStudentResultOverview");
    expect(toolsPage).toContain("<DashboardShell");

    const savedRoute =
      "../../../../apps/web/src/app/dashboard/saved/page.tsx";

    expect(existsSync(new URL(savedRoute, root))).toBe(true);

    const savedPage = read(savedRoute);

    expect(savedPage).toContain("listStudentResults");
    expect(savedPage).toContain("<DashboardShell");
    expect(savedPage).toContain("DeleteSavedResultButton");
  });

  it("ships every admin navigation destination", () => {
    for (const route of [
      "admin/tools/page.tsx",
      "admin/content/page.tsx",
      "admin/analytics/page.tsx",
      "admin/seo/page.tsx",
      "admin/monetization/page.tsx",
      "admin/support/page.tsx",
      "admin/settings/page.tsx",
    ]) {
      expect(existsSync(new URL(route, root))).toBe(true);
      expect(read(route)).toContain("AdminSectionPage");
    }

    const usersRoute = "admin/users/page.tsx";
    expect(existsSync(new URL(usersRoute, root))).toBe(true);

    const usersPage = read(usersRoute);
    expect(usersPage).toContain("<AdminShell");
    expect(usersPage).toContain(
      'requireAdminWorkspaceAccess("/admin/users")',
    );
    expect(usersPage).toContain("listAdminUsers");
    expect(usersPage).toContain("listAccessAudit");
  });
});
