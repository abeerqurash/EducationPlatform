import {
  describe,
  expect,
  it,
} from "vitest";

import {
  MAX_DECIMAL_PLACES,
  roundDecimal,
  roundHalfUp,
} from "./precision";

describe(
  "shared calculator precision",
  () => {
    it(
      "rounds positive midpoint values half up",
      () => {
        expect(
          roundHalfUp(
            1.005,
            2,
          ),
        ).toBe(1.01);

        expect(
          roundHalfUp(
            2.675,
            2,
          ),
        ).toBe(2.68);
      },
    );

    it(
      "rounds negative midpoint values away from zero",
      () => {
        expect(
          roundHalfUp(
            -1.005,
            2,
          ),
        ).toBe(-1.01);

        expect(
          roundHalfUp(
            -2.675,
            2,
          ),
        ).toBe(-2.68);
      },
    );

    it(
      "supports zero decimal places",
      () => {
        expect(
          roundHalfUp(
            1.5,
            0,
          ),
        ).toBe(2);

        expect(
          roundHalfUp(
            -1.5,
            0,
          ),
        ).toBe(-2);
      },
    );

    it(
      "preserves values below the midpoint",
      () => {
        expect(
          roundHalfUp(
            1.004,
            2,
          ),
        ).toBe(1);

        expect(
          roundHalfUp(
            -1.004,
            2,
          ),
        ).toBe(-1);
      },
    );

    it(
      "normalizes negative zero",
      () => {
        const result =
          roundHalfUp(
            -0.0001,
            2,
          );

        expect(result).toBe(0);
        expect(
          Object.is(
            result,
            -0,
          ),
        ).toBe(false);
      },
    );

    it(
      "supports exponential notation",
      () => {
        expect(
          roundHalfUp(
            1.25e-7,
            8,
          ),
        ).toBe(
          1.3e-7,
        );
      },
    );

    it(
      "rejects invalid decimal precision",
      () => {
        expect(
          () =>
            roundHalfUp(
              1.23,
              -1,
            ),
        ).toThrow(
          RangeError,
        );

        expect(
          () =>
            roundHalfUp(
              1.23,
              1.5,
            ),
        ).toThrow(
          RangeError,
        );

        expect(
          () =>
            roundHalfUp(
              1.23,
              MAX_DECIMAL_PLACES +
                1,
            ),
        ).toThrow(
          RangeError,
        );
      },
    );

    it(
      "rejects non-finite values",
      () => {
        expect(
          () =>
            roundHalfUp(
              Number.NaN,
              2,
            ),
        ).toThrow(
          RangeError,
        );

        expect(
          () =>
            roundHalfUp(
              Number.POSITIVE_INFINITY,
              2,
            ),
        ).toThrow(
          RangeError,
        );
      },
    );

    it(
      "uses half-up through the generic rounding API",
      () => {
        expect(
          roundDecimal(
            12.345,
            2,
            "half-up",
          ),
        ).toBe(12.35);
      },
    );
  },
);
