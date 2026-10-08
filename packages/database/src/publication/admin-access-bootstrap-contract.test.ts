import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const repository = readFileSync(
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

describe("admin bootstrap and role operations", () => {
  it("permits first-admin bootstrap only while no platform admin exists", () => {
    expect(repository).toContain("getPlatformAdminBootstrapState");
    expect(repository).toContain("bootstrapFirstPlatformAdmin");
    expect(repository).toContain(
      "Platform administrator bootstrap is already complete.",
    );
    expect(actions).toContain(
      'access.mode !== "publication-compatibility"',
    );
    expect(actions).toContain("!state.needsFirstAdmin");
  });

  it("requires dedicated admin access for ordinary mutations", () => {
    expect(actions).toContain("requireDedicatedAdmin");
    expect(actions).toContain("assignUserRoleAction");
    expect(actions).toContain("removeUserRoleAction");
    expect(actions).toContain("setUserActiveStateAction");
  });

  it("protects the acting and final platform administrator", () => {
    expect(repository).toContain(
      "cannot revoke your own platform administrator access",
    );
    expect(repository).toContain(
      "final platform administrator cannot be revoked",
    );
    expect(repository).toContain(
      "You cannot deactivate your own account",
    );
    expect(repository).toContain(
      "final platform administrator cannot be deactivated",
    );
  });

  it("requires an audit reason for privilege mutations", () => {
    expect(actions).toContain(
      "A reason between 8 and 500 characters is required.",
    );
    expect(repository).toContain('action: "permission_change"');
  });

  it("exposes bootstrap, role and account controls", () => {
    expect(page).toContain("bootstrapPlatformAdminAction");
    expect(page).toContain("assignUserRoleAction");
    expect(page).toContain("removeUserRoleAction");
    expect(page).toContain("setUserActiveStateAction");
    expect(page).toContain("Become first platform admin");
  });
});
