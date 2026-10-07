import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateAverage,
  safeCalculateAverage,
} from "./average";

describe(
  "Average calculator",
  () => {
    it(
      "calculates an arithmetic mean",
      () => {
        const result =
          calculateAverage([
            10,
            20,
            30,
          ]);

        expect(
          result.average,
        ).toBe(20);

        expect(
          result.sum,
        ).toBe(60);

        expect(
          result.count,
        ).toBe(3);
      },
    );

    it(
      "supports decimal values",
      () => {
        expect(
          calculateAverage([
            1.5,
            2.5,
            3.5,
          ]).average,
        ).toBe(2.5);
      },
    );

    it(
      "supports negative values",
      () => {
        expect(
          calculateAverage([
            -10,
            0,
            10,
          ]).average,
        ).toBe(0);
      },
    );

    it(
      "returns minimum and maximum",
      () => {
        const result =
          calculateAverage([
            8,
            3,
            12,
            5,
          ]);

        expect(
          result.minimum,
        ).toBe(3);

        expect(
          result.maximum,
        ).toBe(12);
      },
    );

    it(
      "handles one value",
      () => {
        expect(
          calculateAverage([
            42,
          ]).average,
        ).toBe(42);
      },
    );

    it(
      "rejects an empty list",
      () => {
        expect(
          safeCalculateAverage(
            [],
          ).success,
        ).toBe(false);
      },
    );

    it(
      "rejects NaN",
      () => {
        expect(
          safeCalculateAverage([
            10,
            Number.NaN,
          ]).success,
        ).toBe(false);
      },
    );

    it(
      "rejects infinity",
      () => {
        expect(
          safeCalculateAverage([
            10,
            Number.POSITIVE_INFINITY,
          ]).success,
        ).toBe(false);
      },
    );
  },
);