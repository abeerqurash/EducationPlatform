import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculatePercentage,
  safeCalculatePercentage,
} from "./percentage";

describe(
  "Percentage calculator",
  () => {
    it(
      "calculates a standard percentage",
      () => {
        const result =
          calculatePercentage({
            part: 25,
            whole: 200,
          });

        expect(
          result.percentage,
        ).toBe(12.5);
      },
    );

    it(
      "calculates 100 percent",
      () => {
        expect(
          calculatePercentage({
            part: 50,
            whole: 50,
          }).percentage,
        ).toBe(100);
      },
    );

    it(
      "supports percentages above 100",
      () => {
        expect(
          calculatePercentage({
            part: 150,
            whole: 100,
          }).percentage,
        ).toBe(150);
      },
    );

    it(
      "supports decimal values",
      () => {
        expect(
          calculatePercentage({
            part: 1,
            whole: 3,
          }).percentage,
        ).toBe(33.333333);
      },
    );

    it(
      "supports zero as the part",
      () => {
        expect(
          calculatePercentage({
            part: 0,
            whole: 100,
          }).percentage,
        ).toBe(0);
      },
    );

    it(
      "rejects a zero whole",
      () => {
        expect(
          safeCalculatePercentage({
            part: 10,
            whole: 0,
          }).success,
        ).toBe(false);
      },
    );

    it(
      "rejects non-finite part values",
      () => {
        expect(
          safeCalculatePercentage({
            part: Number.NaN,
            whole: 100,
          }).success,
        ).toBe(false);
      },
    );

    it(
      "rejects non-finite whole values",
      () => {
        expect(
          safeCalculatePercentage({
            part: 10,
            whole:
              Number.POSITIVE_INFINITY,
          }).success,
        ).toBe(false);
      },
    );
  },
);