import {
  describe,
  expect,
  it,
} from "vitest";

import {
  planPublicationWorkflow,
} from "./workflow";

const reviewedAt =
  new Date(
    "2026-10-07T13:00:00.000Z",
  );

const verifiedReviewState = {
  toolStatus:
    "review" as const,

  calculatorVerificationStatus:
    "verified" as const,

  formulaVerificationStatus:
    "verified" as const,

  sourceVerificationStatuses:
    [
      "verified" as const,
  ],

  latestReviewStatus:
    "approved" as const,

  latestReviewReviewedAt:
    reviewedAt,
};

describe(
  "publication workflow planning",
  () => {
    it(
      "moves a draft tool into review without publishing it",
      () => {
        const plan =
          planPublicationWorkflow(
            "submit_for_review",
            {
              ...verifiedReviewState,
              toolStatus:
                "draft",
            },
          );

        expect(
          plan.allowed,
        ).toBe(true);

        expect(
          plan.toStatus,
        ).toBe("review");

        expect(
          plan.updates,
        ).toEqual({
          toolStatus:
            "review",
        });
      },
    );

    it(
      "does not allow an archived tool to enter review",
      () => {
        const plan =
          planPublicationWorkflow(
            "submit_for_review",
            {
              ...verifiedReviewState,
              toolStatus:
                "archived",
            },
          );

        expect(
          plan.allowed,
        ).toBe(false);

        expect(
          plan.toStatus,
        ).toBe("archived");
      },
    );

    it(
      "does not use submit-for-review as a published-tool revision shortcut",
      () => {
        const plan =
          planPublicationWorkflow(
            "submit_for_review",
            {
              ...verifiedReviewState,
              toolStatus:
                "published",
            },
          );

        expect(
          plan.allowed,
        ).toBe(false);
      },
    );

    it(
      "publishes only after the strict editorial gate passes",
      () => {
        const plan =
          planPublicationWorkflow(
            "publish",
            verifiedReviewState,
          );

        expect(
          plan.allowed,
        ).toBe(true);

        expect(
          plan.toStatus,
        ).toBe(
          "published",
        );

        expect(
          plan.updates
            .lastReviewedAt,
        ).toEqual(
          reviewedAt,
        );
      },
    );

    it(
      "keeps the tool in review when calculator verification is pending",
      () => {
        const plan =
          planPublicationWorkflow(
            "publish",
            {
              ...verifiedReviewState,

              calculatorVerificationStatus:
                "pending",
            },
          );

        expect(
          plan.allowed,
        ).toBe(false);

        expect(
          plan.toStatus,
        ).toBe("review");

        expect(
          plan.issues.map(
            (item) =>
              item.code,
          ),
        ).toContain(
          "CALCULATOR_NOT_VERIFIED",
        );
      },
    );

    it(
      "keeps the tool in review when no verified source exists",
      () => {
        const plan =
          planPublicationWorkflow(
            "publish",
            {
              ...verifiedReviewState,

              sourceVerificationStatuses:
                [
                  "pending",
                ],
            },
          );

        expect(
          plan.allowed,
        ).toBe(false);

        expect(
          plan.issues.map(
            (item) =>
              item.code,
          ),
        ).toContain(
          "VERIFIED_SOURCE_MISSING",
        );
      },
    );

    it(
      "keeps the tool in review when editorial approval is missing",
      () => {
        const plan =
          planPublicationWorkflow(
            "publish",
            {
              ...verifiedReviewState,

              latestReviewStatus:
                "changes_requested",

              latestReviewReviewedAt:
                reviewedAt,
            },
          );

        expect(
          plan.allowed,
        ).toBe(false);

        expect(
          plan.issues.map(
            (item) =>
              item.code,
          ),
        ).toContain(
          "APPROVED_REVIEW_MISSING",
        );
      },
    );

    it(
      "supports verified dataset-driven calculators without formula versions",
      () => {
        const plan =
          planPublicationWorkflow(
            "publish",
            {
              ...verifiedReviewState,

              formulaVerificationStatus:
                null,

              requireFormula:
                false,
            },
          );

        expect(
          plan.allowed,
        ).toBe(true);
      },
    );
  },
);
