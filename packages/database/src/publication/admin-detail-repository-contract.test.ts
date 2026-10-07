import {
  describe,
  expect,
  it,
} from "vitest";
import {
  readFileSync,
} from "node:fs";
import {
  fileURLToPath,
} from "node:url";

const source = readFileSync(
  fileURLToPath(
    new URL(
      "./admin-detail-repository.ts",
      import.meta.url,
    ),
  ),
  "utf8",
);

describe("admin publication detail repository", () => {
  it("derives readiness from persisted editorial state", () => {
    expect(source).toContain(
      "evaluateEditorialPublicationGate({",
    );
    expect(source).toContain(
      "calculatorVersions",
    );
    expect(source).toContain(
      "formulaVersions",
    );
    expect(source).toContain(
      "calculatorVersionSources",
    );
    expect(source).toContain(
      "reviews",
    );
    expect(source).toContain(
        "resolveCalculatorPublicationRequirements",
      );
    expect(source).not.toMatch(
        /input\.requireVerifiedSource/,
      );
  });

  it("exposes publication context without inventing editorial state", () => {
    expect(source).toContain(
      "categoryName",
    );
    expect(source).toContain(
      "applicableYear",
    );
    expect(source).toContain(
      "lastReviewedAt",
    );
    expect(source).toContain(
      "latestReview",
    );
    expect(source).toContain(
      "reviews.notes",
    );
    expect(source).toContain(
      "reviews.reviewerId",
    );
    expect(source).toContain(
      "reviews.id",
    );
    expect(source).toContain(
      "verifiedSources",
    );
    expect(source).toContain(
      "sourceRows.length",
    );
  });

  it("is read only", () => {
    expect(source).not.toMatch(/\.update\s*\(/);
    expect(source).not.toMatch(/\.insert\s*\(/);
    expect(source).not.toMatch(/\.delete\s*\(/);
  });

  it(
    "keeps readiness requirements aligned with trusted mutation defaults",
    () => {
      expect(source).toContain(
        "resolveCalculatorPublicationRequirements",
      );
      expect(source).not.toMatch(
        /input\.requireVerifiedSource/,
      );
      expect(source).not.toMatch(
        /input\.requireFormula/,
      );
      expect(source).not.toMatch(
        /input\.requireVerifiedSource/,
      );
    },
  );


  it(
    "selects only completed reviews for latest-review readiness",
    () => {
      expect(source).toContain(
        "asc(sources.id)",
      );
      expect(source).toMatch(
        /desc\(\s*formulaVersions\.id,?\s*\)/,
      );
      expect(source).toContain(
        "desc(reviews.id)",
      );
      expect(source).toContain(
        "sources.id",
      );
      expect(source).toContain(
        "formulaVersions.id",
      );
      expect(source).toContain(
        "desc(reviews.reviewedAt)",
      );
      expect(source).toContain(
        "desc(reviews.createdAt)",
      );
      expect(source).toContain(
        "isNotNull(",
      );
      expect(source).toContain(
        "reviews.reviewedAt",
      );
    },
  );

});
