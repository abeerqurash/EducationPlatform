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

/**
 * These tests exercise the persistence contract without requiring a
 * live database. Database integration/rollback tests belong in the
 * later integration-test layer with an isolated PostgreSQL database.
 */
describe(
  "publication persistence contract",
  () => {
    it(
      "produces one allowed transition and one matching audit plan before persistence",
      () => {
        const reviewedAt =
          new Date(
            "2026-10-07T15:00:00.000Z",
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
                reviewedAt,
            },
          );

        const audit =
          createPublicationAuditPlan(
            plan,
          );

        expect(
          plan.allowed,
        ).toBe(true);

        expect(
          plan.fromStatus,
        ).toBe("review");

        expect(
          plan.toStatus,
        ).toBe(
          "published",
        );

        expect(
          audit,
        ).not.toBeNull();

        expect(
          audit?.action,
        ).toBe("publish");

        expect(
          audit?.after
            .lastReviewedAt,
        ).toBe(
          reviewedAt.toISOString(),
        );
      },
    );

    it(
      "produces no audit mutation when the publication gate blocks the transition",
      () => {
        const plan =
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
                [
                  "pending",
                ],

              latestReviewStatus:
                "pending",

              latestReviewReviewedAt:
                null,
            },
          );

        expect(
          plan.allowed,
        ).toBe(false);

        expect(
          createPublicationAuditPlan(
            plan,
          ),
        ).toBeNull();
      },
    );
  },
);
