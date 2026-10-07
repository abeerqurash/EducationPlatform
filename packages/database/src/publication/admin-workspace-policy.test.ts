import { describe, expect, it } from "vitest";
import {
  evaluateAdminWorkspaceAccess,
} from "./admin-workspace-policy";

describe("admin workspace policy", () => {
  it("prefers the dedicated platform admin permission", () => {
    expect(
      evaluateAdminWorkspaceAccess({
        userId: "user",
        permissionKeys: ["platform.admin.access"],
      }),
    ).toEqual({
      allowed: true,
      mode: "dedicated",
    });
  });

  it("keeps current publication administrators working during migration", () => {
    expect(
      evaluateAdminWorkspaceAccess({
        userId: "user",
        permissionKeys: ["calculators.publish"],
      }),
    ).toEqual({
      allowed: true,
      mode: "publication-compatibility",
    });
  });

  it("denies unrelated authenticated users", () => {
    expect(
      evaluateAdminWorkspaceAccess({
        userId: "user",
        permissionKeys: [],
      }).allowed,
    ).toBe(false);
  });
});
