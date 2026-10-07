import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const access = readFileSync(
  new URL(
    "../../../../apps/web/src/lib/admin-workspace-access.ts",
    import.meta.url,
  ),
  "utf8",
);

const overview = readFileSync(
  new URL(
    "../../../../apps/web/src/app/admin/page.tsx",
    import.meta.url,
  ),
  "utf8",
);

describe("admin workspace access boundary", () => {
  it("uses the established database-backed publication permissions", () => {
    expect(access).toContain("resolvePublicationActor");
    expect(access).toContain("publicationPermissions.submitForReview");
    expect(access).toContain("publicationPermissions.publish");
    expect(access).toContain('redirect("/dashboard")');
    expect(access).toContain("../../../../packages/database/src/publication/actor-resolver");
    expect(access).toContain("const user = session?.user");
    expect(access).toContain("if (!user || !userId)");
  });

  it("protects the admin overview with the shared boundary", () => {
    expect(overview).toContain('requireAdminWorkspaceAccess("/admin")');
  });
});
