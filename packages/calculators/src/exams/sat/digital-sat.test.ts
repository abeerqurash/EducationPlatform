import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateDigitalSatEstimate,
  safeCalculateDigitalSatEstimate,
} from "./digital-sat";

describe(
  "Digital SAT estimator",
  () => {
    it(
      "calculates perfect-input score ranges",
      () => {
        const result =
          calculateDigitalSatEstimate({
            readingWritingModule1Correct:
              27,

            readingWritingModule2Correct:
              27,

            mathModule1Correct:
              22,

            mathModule2Correct:
              22,
          });

        expect(
          result.readingWriting.correct,
        ).toBe(54);

        expect(
          result.math.correct,
        ).toBe(44);

        expect(
          result.totalCorrect,
        ).toBe(98);

        expect(
          result.estimatedTotalScore,
        ).toEqual({
          min: 1520,
          max: 1600,
        });
      },
    );

    it(
      "calculates minimum-input score ranges",
      () => {
        const result =
          calculateDigitalSatEstimate({
            readingWritingModule1Correct:
              0,

            readingWritingModule2Correct:
              0,

            mathModule1Correct:
              0,

            mathModule2Correct:
              0,
          });

        expect(
          result.estimatedTotalScore,
        ).toEqual({
          min: 400,
          max: 480,
        });
      },
    );

    it(
      "combines module totals by section",
      () => {
        const result =
          calculateDigitalSatEstimate({
            readingWritingModule1Correct:
              20,

            readingWritingModule2Correct:
              15,

            mathModule1Correct:
              10,

            mathModule2Correct:
              12,
          });

        expect(
          result.readingWriting.correct,
        ).toBe(35);

        expect(
          result.math.correct,
        ).toBe(22);

        expect(
          result.totalCorrect,
        ).toBe(57);
      },
    );

    it(
      "never claims to return an official score",
      () => {
        const result =
          calculateDigitalSatEstimate({
            readingWritingModule1Correct:
              20,

            readingWritingModule2Correct:
              20,

            mathModule1Correct:
              15,

            mathModule2Correct:
              15,
          });

        expect(
          result.isOfficialScore,
        ).toBe(false);

        expect(
          result.dataset.sourceType,
        ).toBe("estimated");
      },
    );

    it(
      "rejects Reading and Writing values above 27",
      () => {
        const result =
          safeCalculateDigitalSatEstimate({
            readingWritingModule1Correct:
              28,

            readingWritingModule2Correct:
              20,

            mathModule1Correct:
              20,

            mathModule2Correct:
              20,
          });

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "rejects Math values above 22",
      () => {
        const result =
          safeCalculateDigitalSatEstimate({
            readingWritingModule1Correct:
              20,

            readingWritingModule2Correct:
              20,

            mathModule1Correct:
              23,

            mathModule2Correct:
              20,
          });

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "rejects negative values",
      () => {
        const result =
          safeCalculateDigitalSatEstimate({
            readingWritingModule1Correct:
              -1,

            readingWritingModule2Correct:
              20,

            mathModule1Correct:
              20,

            mathModule2Correct:
              20,
          });

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "rejects fractional correct-answer counts",
      () => {
        const result =
          safeCalculateDigitalSatEstimate({
            readingWritingModule1Correct:
              20.5,

            readingWritingModule2Correct:
              20,

            mathModule1Correct:
              20,

            mathModule2Correct:
              20,
          });

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "rejects NaN",
      () => {
        const result =
          safeCalculateDigitalSatEstimate({
            readingWritingModule1Correct:
              Number.NaN,

            readingWritingModule2Correct:
              20,

            mathModule1Correct:
              20,

            mathModule2Correct:
              20,
          });

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "keeps total estimates inside the official score boundaries",
      () => {
        const inputs = [
          [0, 0, 0, 0],
          [10, 10, 10, 10],
          [20, 20, 15, 15],
          [27, 27, 22, 22],
        ] as const;

        for (
          const [
            rw1,
            rw2,
            math1,
            math2,
          ] of inputs
        ) {
          const result =
            calculateDigitalSatEstimate({
              readingWritingModule1Correct:
                rw1,

              readingWritingModule2Correct:
                rw2,

              mathModule1Correct:
                math1,

              mathModule2Correct:
                math2,
            });

          expect(
            result.estimatedTotalScore
              .min,
          ).toBeGreaterThanOrEqual(
            400,
          );

          expect(
            result.estimatedTotalScore
              .max,
          ).toBeLessThanOrEqual(
            1600,
          );
        }
      },
    );
  },
);