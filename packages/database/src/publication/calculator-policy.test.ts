import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  PublicCalculatorRecord,
} from "../repositories/public-tools";

import {
  evaluateCalculatorPublication,
} from "./calculator-policy";

function createCalculator(
  overrides: Partial<
    PublicCalculatorRecord
  > = {},
): PublicCalculatorRecord {
  const base:
    PublicCalculatorRecord = {
    tool: {
      id: "tool-1",
      name:
        "GPA Calculator",
      slug:
        "gpa-calculator",

      shortDescription:
        "Calculate GPA.",

      description:
        "Calculate GPA.",

      access: "free",

      status:
        "published",

      currentVersion:
        "1.0.0",

      applicableYear:
        2026,

      lastReviewedAt:
        new Date(
          "2026-10-07T00:00:00Z",
        ),
    },

    category: {
      id: "category-1",
      name:
        "GPA Calculators",
      slug: "gpa",
    },

    calculatorVersion: {
      id: "calculator-1",

      version:
        "1.0.0",

      applicableYear:
        2026,

      effectiveFrom:
        new Date(
          "2026-10-07T00:00:00Z",
        ),

      effectiveUntil:
        null,

      methodology:
        "Credit-weighted GPA methodology.",

      configuration:
        null,

      verificationStatus:
        "verified",

      isActive: true,
    },

    formulaVersion: {
      id: "formula-1",

      version:
        "1.0.0",

      definition: {
        engine:
          "education-calculators",

        module: "gpa",
      },

      precision: 3,

      tolerance:
        "0.0005000000",

      verificationStatus:
        "verified",

      isActive: true,
    },

    sources: [
      {
        id: "source-1",

        title:
          "Verified source",

        publisher:
          "Publisher",

        url:
          "https://example.com/source",

        type:
          "official",

        verificationStatus:
          "verified",
      },
    ],

    latestReview: {
      status:
        "approved",

      reviewedAt:
        new Date(
          "2026-10-07T00:00:00Z",
        ),

      reviewerName:
        "Reviewer",
    },
  };

  return {
    ...base,
    ...overrides,
  };
}

describe(
  "calculator publication policy",
  () => {
    it(
      "marks a complete calculator as verified",
      () => {
        const result =
          evaluateCalculatorPublication(
            createCalculator(),
          );

        expect(
          result.level,
        ).toBe("verified");

        expect(
          result.publishable,
        ).toBe(true);

        expect(
          result.verified,
        ).toBe(true);

        expect(
          result.issues,
        ).toHaveLength(0);
      },
    );

    it(
      "allows an unverified calculator to be structurally publishable",
      () => {
        const calculator =
          createCalculator();

        calculator.calculatorVersion.verificationStatus =
          "unverified";

        calculator.formulaVersion!.verificationStatus =
          "unverified";

        calculator.sources =
          [];

        calculator.latestReview =
          null;

        const result =
          evaluateCalculatorPublication(
            calculator,
          );

        expect(
          result.level,
        ).toBe(
          "publishable",
        );

        expect(
          result.publishable,
        ).toBe(true);

        expect(
          result.verified,
        ).toBe(false);

        expect(
          result.issues.some(
            (issue) =>
              issue.code ===
              "CALCULATOR_UNVERIFIED",
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects a missing formula",
      () => {
        const calculator =
          createCalculator({
            formulaVersion:
              null,
          });

        const result =
          evaluateCalculatorPublication(
            calculator,
          );

        expect(
          result.publishable,
        ).toBe(false);

        expect(
          result.issues.some(
            (issue) =>
              issue.code ===
              "FORMULA_MISSING",
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects a calculator version mismatch",
      () => {
        const calculator =
          createCalculator();

        calculator.tool.currentVersion =
          "2.0.0";

        const result =
          evaluateCalculatorPublication(
            calculator,
          );

        expect(
          result.publishable,
        ).toBe(false);

        expect(
          result.issues.some(
            (issue) =>
              issue.code ===
              "VERSION_MISMATCH",
          ),
        ).toBe(true);
      },
    );

    it(
      "requires approved review for verified readiness",
      () => {
        const calculator =
          createCalculator();

        calculator.latestReview =
          {
            status:
              "changes_requested",

            reviewedAt:
              new Date(),

            reviewerName:
              "Reviewer",
          };

        const result =
          evaluateCalculatorPublication(
            calculator,
          );

        expect(
          result.publishable,
        ).toBe(true);

        expect(
          result.verified,
        ).toBe(false);

        expect(
          result.issues.some(
            (issue) =>
              issue.code ===
              "REVIEW_NOT_APPROVED",
          ),
        ).toBe(true);
      },
    );
  },
);