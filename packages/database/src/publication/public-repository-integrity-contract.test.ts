import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL("../repositories/public-tools.ts", import.meta.url),
  "utf8",
);

describe("public calculator repository integrity", () => {
  it("selects the active formula deterministically", () => {
    expect(source).toContain("desc(formulaVersions.createdAt)");
    expect(source).toContain("desc(formulaVersions.id)");
  });

  it("only exposes verified sources in deterministic order", () => {
    expect(source).toContain('eq(sources.verificationStatus, "verified")');
    expect(source).toContain("asc(sources.id)");
  });

  it("only exposes completed approved review evidence deterministically", () => {
    expect(source).toContain('eq(reviews.status, "approved")');
    expect(source).toContain("isNotNull(reviews.reviewedAt)");
    expect(source).toContain("desc(reviews.reviewedAt)");
    expect(source).toContain("desc(reviews.id)");
  });
});
