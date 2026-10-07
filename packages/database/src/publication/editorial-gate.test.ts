import {
  describe,
  expect,
  it,
} from "vitest";

import {
  evaluateEditorialPublicationGate,
} from "./editorial-gate";

const reviewedAt =
  new Date(
    "2026-10-07T12:00:00.000Z",
  );

describe(
  "editorial publication gate",
  () => {
    it(
      "allows a fully verified and approved calculator",
      () => {
        const result =
          evaluateEditorialPublicationGate(
            {
              toolStatus:
                "review",

              calculatorVerificationStatus:
                "verified",

              formulaVerificationStatus:
                "verified",

              sourceVerificationStatuses:
                [
                  "verified",
                ],

              latestReviewStatus:
                "approved",

              latestReviewReviewedAt:
                reviewedAt,
            },
          );

        expect(
          result.canPublish,
        ).toBe(true);

        expect(
          result.issues,
        ).toEqual([]);
      },
    );

    it(
      "blocks a draft tool",
      () => {
        const result =
          evaluateEditorialPublicationGate(
            {
              toolStatus:
                "draft",

              calculatorVerificationStatus:
                "verified",

              formulaVerificationStatus:
                "verified",

              sourceVerificationStatuses:
                [
                  "verified",
                ],

              latestReviewStatus:
                "approved",

              latestReviewReviewedAt:
                reviewedAt,
            },
          );

        expect(
          result.canPublish,
        ).toBe(false);

        expect(
          result.issues.map(
            (item) =>
              item.code,
          ),
        ).toContain(
          "TOOL_NOT_IN_REVIEW",
        );
      },
    );

    it(
      "blocks an unverified calculator version",
      () => {
        const result =
          evaluateEditorialPublicationGate(
            {
              toolStatus:
                "review",

              calculatorVerificationStatus:
                "pending",

              formulaVerificationStatus:
                "verified",

              sourceVerificationStatuses:
                [
                  "verified",
                ],

              latestReviewStatus:
                "approved",

              latestReviewReviewedAt:
                reviewedAt,
            },
          );

        expect(
          result.issues.map(
            (item) =>
              item.code,
          ),
        ).toContain(
          "CALCULATOR_NOT_VERIFIED",
        );
      },
    );

    it(
      "blocks a required formula that is not verified",
      () => {
        const result =
          evaluateEditorialPublicationGate(
            {
              toolStatus:
                "review",

              calculatorVerificationStatus:
                "verified",

              formulaVerificationStatus:
                "pending",

              sourceVerificationStatuses:
                [
                  "verified",
                ],

              latestReviewStatus:
                "approved",

              latestReviewReviewedAt:
                reviewedAt,
            },
          );

        expect(
          result.issues.map(
            (item) =>
              item.code,
          ),
        ).toContain(
          "FORMULA_NOT_VERIFIED",
        );
      },
    );

    it(
      "supports dataset-driven calculators without a formula",
      () => {
        const result =
          evaluateEditorialPublicationGate(
            {
              toolStatus:
                "review",

              calculatorVerificationStatus:
                "verified",

              formulaVerificationStatus:
                null,

              sourceVerificationStatuses:
                [
                  "verified",
                ],

              latestReviewStatus:
                "approved",

              latestReviewReviewedAt:
                reviewedAt,

              requireFormula:
                false,
            },
          );

        expect(
          result.canPublish,
        ).toBe(true);
      },
    );

    it(
      "blocks publication when no source is verified",
      () => {
        const result =
          evaluateEditorialPublicationGate(
            {
              toolStatus:
                "review",

              calculatorVerificationStatus:
                "verified",

              formulaVerificationStatus:
                "verified",

              sourceVerificationStatuses:
                [
                  "pending",
                  "unverified",
                ],

              latestReviewStatus:
                "approved",

              latestReviewReviewedAt:
                reviewedAt,
            },
          );

        expect(
          result.issues.map(
            (item) =>
              item.code,
          ),
        ).toContain(
          "VERIFIED_SOURCE_MISSING",
        );
      },
    );

    it(
      "blocks publication without an approved review",
      () => {
        const result =
          evaluateEditorialPublicationGate(
            {
              toolStatus:
                "review",

              calculatorVerificationStatus:
                "verified",

              formulaVerificationStatus:
                "verified",

              sourceVerificationStatuses:
                [
                  "verified",
                ],

              latestReviewStatus:
                "pending",

              latestReviewReviewedAt:
                null,
            },
          );

        expect(
          result.issues.map(
            (item) =>
              item.code,
          ),
        ).toContain(
          "APPROVED_REVIEW_MISSING",
        );
      },
    );

    it(
      "blocks an approved review without a review timestamp",
      () => {
        const result =
          evaluateEditorialPublicationGate(
            {
              toolStatus:
                "review",

              calculatorVerificationStatus:
                "verified",

              formulaVerificationStatus:
                "verified",

              sourceVerificationStatuses:
                [
                  "verified",
                ],

              latestReviewStatus:
                "approved",

              latestReviewReviewedAt:
                null,
            },
          );

        expect(
          result.issues.map(
            (item) =>
              item.code,
          ),
        ).toContain(
          "APPROVED_REVIEW_DATE_MISSING",
        );
      },
    );

    it(
      "reports every failing gate instead of stopping at the first issue",
      () => {
        const result =
          evaluateEditorialPublicationGate(
            {
              toolStatus:
                "draft",

              calculatorVerificationStatus:
                "unverified",

              formulaVerificationStatus:
                null,

              sourceVerificationStatuses:
                [],

              latestReviewStatus:
                null,

              latestReviewReviewedAt:
                null,
            },
          );

        expect(
          result.canPublish,
        ).toBe(false);

        expect(
          result.issues.map(
            (item) =>
              item.code,
          ),
        ).toEqual([
          "TOOL_NOT_IN_REVIEW",
          "CALCULATOR_NOT_VERIFIED",
          "FORMULA_MISSING",
          "VERIFIED_SOURCE_MISSING",
          "APPROVED_REVIEW_MISSING",
        ]);
      },
    );
  },
);
