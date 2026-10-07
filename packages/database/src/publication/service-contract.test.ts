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
  planPublicationWorkflow,
} from "./workflow";

describe(
  "publication service contract",
  () => {
    it(
      "requires authorization before an otherwise valid publish plan may reach persistence",
      () => {
        const authorization =
          authorizePublicationAction(
            {
              userId:
                "00000000-0000-4000-8000-000000000001",

              permissionKeys: [],
            },
            "publish",
          );

        const plan =
          planPublicationWorkflow(
            "publish",
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
                  "2026-10-07T16:00:00.000Z",
                ),
            },
          );

        expect(
          plan.allowed,
        ).toBe(true);

        expect(
          authorization.allowed,
        ).toBe(false);
      },
    );

    it(
      "separates submit and publish permissions",
      () => {
        const actor = {
          userId:
            "00000000-0000-4000-8000-000000000001",

          permissionKeys: [
            publicationPermissions
              .submitForReview,
          ],
        };

        expect(
          authorizePublicationAction(
            actor,
            "submit_for_review",
          ).allowed,
        ).toBe(true);

        expect(
          authorizePublicationAction(
            actor,
            "publish",
          ).allowed,
        ).toBe(false);
      },
    );
  },
);
