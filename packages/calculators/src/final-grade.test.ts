import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateFinalGrade,
  safeCalculateFinalGrade,
} from "./final-grade";

describe(
  "Final grade calculator",
  () => {
    it(
      "calculates the required final grade",
      () => {
        const result =
          calculateFinalGrade({
            currentGrade: 80,
            completedWeight: 70,
            desiredGrade: 85,
          });

        expect(
          result.finalWeight,
        ).toBe(30);

        expect(
          result.currentContribution,
        ).toBe(56);

        expect(
          result.requiredFinalGrade,
        ).toBe(96.667);

        expect(
          result.status,
        ).toBe("achievable");
      },
    );

    it(
      "reports a requirement above 100 percent",
      () => {
        const result =
          calculateFinalGrade({
            currentGrade: 70,
            completedWeight: 80,
            desiredGrade: 90,
          });

        expect(
          result.requiredFinalGrade,
        ).toBe(170);

        expect(
          result.status,
        ).toBe(
          "above-normal-range",
        );
      },
    );

    it(
      "detects when the target is already secured",
      () => {
        const result =
          calculateFinalGrade({
            currentGrade: 100,
            completedWeight: 80,
            desiredGrade: 70,
          });

        expect(
          result.requiredFinalGrade,
        ).toBe(-50);

        expect(
          result.status,
        ).toBe(
          "already-secured",
        );
      },
    );

    it(
      "supports a final worth the full course",
      () => {
        const result =
          calculateFinalGrade({
            currentGrade: 0,
            completedWeight: 0,
            desiredGrade: 75,
          });

        expect(
          result.finalWeight,
        ).toBe(100);

        expect(
          result.requiredFinalGrade,
        ).toBe(75);
      },
    );

    it(
      "rejects completed weight of 100 percent",
      () => {
        expect(
          safeCalculateFinalGrade({
            currentGrade: 80,
            completedWeight: 100,
            desiredGrade: 85,
          }).success,
        ).toBe(false);
      },
    );

    it(
      "rejects negative completed weight",
      () => {
        expect(
          safeCalculateFinalGrade({
            currentGrade: 80,
            completedWeight: -1,
            desiredGrade: 85,
          }).success,
        ).toBe(false);
      },
    );

    it(
      "rejects grades above 100",
      () => {
        expect(
          safeCalculateFinalGrade({
            currentGrade: 101,
            completedWeight: 70,
            desiredGrade: 85,
          }).success,
        ).toBe(false);
      },
    );

    it(
      "rejects non-finite values",
      () => {
        expect(
          safeCalculateFinalGrade({
            currentGrade:
              Number.NaN,
            completedWeight: 70,
            desiredGrade: 85,
          }).success,
        ).toBe(false);
      },
    );
  },
);