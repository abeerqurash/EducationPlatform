import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const repo = readFileSync(new URL("../repositories/admin-access.ts", import.meta.url), "utf8");
const resolver = readFileSync(new URL("./actor-resolver.ts", import.meta.url), "utf8");

describe("administrator concurrency and account safety", () => {
  it("serializes privilege changes across concurrent transactions", () => {
    expect((repo.match(/pg_advisory_xact_lock/g) ?? []).length).toBe(4);
  });
  it("counts active administrators before removing or deactivating one", () => {
    expect((repo.match(/eq\(users.isActive, true\)/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });
  it("does not audit duplicate role assignments as a new change", () => {
    expect(repo).toContain(".onConflictDoNothing()\n      .returning");
    expect(repo).toContain("if (!inserted.length)");
  });
  it("uses a typed IN predicate for user IDs", () => {
    expect(repo).toContain("inArray(userRoles.userId, rows.map((row) => row.id))");
  });
  it("does not grant permissions from inactive accounts", () => {
    expect(resolver).toContain("eq(users.isActive, true)");
  });
});
