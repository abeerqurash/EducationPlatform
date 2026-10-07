import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createPublicationAuditPlan,
} from "./audit-plan";

import {
  planPublicationWorkflow,
} from "./workflow";

describe(
  "publication audit planning",
  () => {
    it(
      "creates no audit mutation for a blocked publication",
      () => {
        const workflow =
          planPublicationWorkflow(
            "publish",
            {
              toolStatus:
                "review",

              calculatorVerificationStatus:
                "pending",

              formulaVerificationStatus:
                "pending",

              sourceVerificationStatuses:
                [],

              latestReviewStatus:
                "pending",

              latestReviewReviewedAt:
                null,
            },
          );

        expect(
          createPublicationAuditPlan(
            workflow,
          ),
        ).toBeNull();
      },
    );

    it(
      "creates a review transition audit payload",
      () => {
        const workflow =
          planPublicationWorkflow(
            "submit_for_review",
            {
              toolStatus:
                "draft",

              calculatorVerificationStatus:
                "pending",

              formulaVerificationStatus:
                "pending",

              sourceVerificationStatuses:
                [],

              latestReviewStatus:
                null,

              latestReviewReviewedAt:
                null,
            },
          );

        const audit =
          createPublicationAuditPlan(
            workflow,
          );

        expect(
          audit?.action,
        ).toBe("update");

        expect(
          audit?.before.status,
        ).toBe("draft");

        expect(
          audit?.after.status,
        ).toBe("review");
      },
    );

    it(
      "creates a publication audit payload with the reviewed timestamp",
      () => {
        const reviewedAt =
          new Date(
            "2026-10-07T14:00:00.000Z",
          );

        const workflow =
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
                reviewedAt,
            },
          );

        const audit =
          createPublicationAuditPlan(
            workflow,
          );

        expect(
          audit?.action,
        ).toBe("publish");

        expect(
          audit?.after,
        ).toEqual({
          status:
            "published",

          lastReviewedAt:
            reviewedAt.toISOString(),
        });
      },
    );
  },
);
