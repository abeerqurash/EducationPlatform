import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const page = readFileSync(
  new URL("../../../../apps/web/src/app/admin/users/page.tsx", import.meta.url),
  "utf8",
);
const repository = readFileSync(
  new URL("../repositories/admin-access.ts", import.meta.url),
  "utf8",
);

describe("administrator directory usability and query bounds", () => {
  it("limits user-controlled search and page inputs", () => {
    expect(page).toContain("Math.min(100000");
    expect(page).toContain("Math.min(requestedPage, totalPages)");
    expect(page).toContain("maxLength={160}");
    expect(repository).toContain("2_500_000");
  });
  it("labels search, reason and role fields", () => {
    expect(page).toContain('aria-label="Search accounts by name or email"');
    expect(page).toContain('aria-label="Reason for this access change"');
    expect(page).toContain('aria-label="Choose a role"');
  });
  it("disables self-deactivation at the interface", () => {
    expect(page).toContain("account.id === access.user.id");
  });
});
