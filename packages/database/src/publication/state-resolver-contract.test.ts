import {
  describe,
  expect,
  it,
} from "vitest";

import {
  authorizePublicationAction,
  publicationPermissions,
} from "./authorization";

import {
  evaluateEditorialPublicationGate,
} from "./editorial-gate";

describe(
  "trusted publication resolver contract",
  () => {
    it(
      "requires publish permission before trusted database state is useful",
      () => {
        const result =
          authorizePublicationAction(
            {
              userId:
                "00000000-0000-4000-8000-000000000001",

              permissionKeys: [
                publicationPermissions
                  .submitForReview,
              ],
            },
            "publish",
          );

        expect(
          result.allowed,
        ).toBe(false);
      },
    );

    it(
      "accepts a fully verified state shaped like the resolver output",
      () => {
        const gate =
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
                new Date(
                  "2026-10-07T17:00:00.000Z",
                ),
            },
          );

        expect(
          gate.canPublish,
        ).toBe(true);
      },
    );

    it(
      "keeps dataset-driven calculators explicit rather than pretending a formula exists",
      () => {
        const gate =
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
                new Date(
                  "2026-10-07T17:00:00.000Z",
                ),

              requireFormula:
                false,
            },
          );

        expect(
          gate.canPublish,
        ).toBe(true);
      },
    );
  },
);
