import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const repo = readFileSync(
  new URL("../repositories/admin-access.ts", import.meta.url),
  "utf8",
);
const actions = readFileSync(
  new URL("../../../../apps/web/src/app/actions/admin-access.ts", import.meta.url),
  "utf8",
);
const page = readFileSync(
  new URL("../../../../apps/web/src/app/admin/users/page.tsx", import.meta.url),
  "utf8",
);

describe("platform admin access management", () => {
  it("requires dedicated admin permission for privilege mutation", () => {
    expect(actions).toContain("adminWorkspacePermissions.access");
    expect(actions).toContain("resolvePublicationActor");
    expect(actions).toContain("Dedicated platform administrator access is required.");
  });

  it("audits grants and revocations", () => {
    expect(repo).toContain('"permission_change"');
    expect(repo).toContain("Role ${role.name} assigned.");
    expect(repo).toContain("Role ${role.name} removed.");
  });

  it("prevents self revocation and final-admin removal", () => {
    expect(repo).toContain("cannot revoke your own");
    expect(repo).toContain("final platform administrator");
  });

  it("ships a real protected users and access workspace", () => {
    expect(page).toContain('requireAdminWorkspaceAccess("/admin/users")');
    expect(page).toContain("listAdminUsers");
    expect(page).toContain("getAdminAccessSummary");
    expect(page).toContain("listAccessAudit");
    expect(page).toContain("publication-compatibility access");
  });

  it("uses only supported application icons", () => {
    expect(page).not.toContain('icon="shield"');
    expect(page).toContain(
      'note="Dedicated administrators" icon="settings"',
    );
  });


  it("does not classify the operational users route as a generic admin placeholder", () => {
    const routes = readFileSync(
      new URL("./application-routes-contract.test.ts", import.meta.url),
      "utf8",
    );
    const adminTest = routes.split(
      'it("ships every admin navigation destination"',
    )[1] ?? "";
    const genericLoop = adminTest.split(
      'expect(read(route)).toContain("AdminSectionPage")',
    )[0] ?? "";

    expect(genericLoop).not.toContain(
      "admin/users/page.tsx",
    );
  });

});
