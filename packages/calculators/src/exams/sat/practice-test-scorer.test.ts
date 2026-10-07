import {
  describe,
  expect,
  it,
} from "vitest";

import {
  SAT_PRACTICE_TEST_10_DATASET,
} from "./practice-test-10-dataset";

import {
  calculateSatPracticeTestScore,
  safeCalculateSatPracticeTestScore,
} from "./practice-test-scorer";

describe(
  "SAT paper Practice Test #10 scoring",
  () => {
    it(
      "contains every published Reading and Writing raw score",
      () => {
        expect(
          SAT_PRACTICE_TEST_10_DATASET
            .readingWriting,
        ).toHaveLength(67);

        expect(
          SAT_PRACTICE_TEST_10_DATASET
            .readingWriting[66],
        ).toEqual({
          rawScore: 66,
          min: 800,
          max: 800,
        });
      },
    );

    it(
      "contains every published Math raw score",
      () => {
        expect(
          SAT_PRACTICE_TEST_10_DATASET
            .math,
        ).toHaveLength(55);

        expect(
          SAT_PRACTICE_TEST_10_DATASET
            .math[54],
        ).toEqual({
          rawScore: 54,
          min: 800,
          max: 800,
        });
      },
    );

    it(
      "scores a zero raw score at 200 per section",
      () => {
        const result =
          calculateSatPracticeTestScore({
            readingWritingCorrect: 0,
            mathCorrect: 0,
          });

        expect(
          result.totalScore,
        ).toEqual({
          min: 400,
          max: 400,
        });
      },
    );

    it(
      "uses the published row for Reading and Writing raw score 34",
      () => {
        const result =
          calculateSatPracticeTestScore({
            readingWritingCorrect: 34,
            mathCorrect: 0,
          });

        expect(
          result.readingWritingScore,
        ).toEqual({
          min: 430,
          max: 470,
        });
      },
    );

    it(
      "uses the published row for Math raw score 44",
      () => {
        const result =
          calculateSatPracticeTestScore({
            readingWritingCorrect: 0,
            mathCorrect: 44,
          });

        expect(
          result.mathScore,
        ).toEqual({
          min: 620,
          max: 680,
        });
      },
    );

    it(
      "adds lower and upper section values independently",
      () => {
        const result =
          calculateSatPracticeTestScore({
            readingWritingCorrect: 50,
            mathCorrect: 40,
          });

        expect(
          result.readingWritingScore,
        ).toEqual({
          min: 580,
          max: 640,
        });

        expect(
          result.mathScore,
        ).toEqual({
          min: 580,
          max: 640,
        });

        expect(
          result.totalScore,
        ).toEqual({
          min: 1160,
          max: 1280,
        });
      },
    );

    it(
      "marks the conversion as official practice data but not a live official score",
      () => {
        const result =
          calculateSatPracticeTestScore({
            readingWritingCorrect: 66,
            mathCorrect: 54,
          });

        expect(
          result
            .isOfficialPracticeConversion,
        ).toBe(true);

        expect(
          result.isOfficialLiveSatScore,
        ).toBe(false);

        expect(
          result.totalScore,
        ).toEqual({
          min: 1600,
          max: 1600,
        });
      },
    );

    it(
      "rejects Reading and Writing scores above 66",
      () => {
        expect(
          safeCalculateSatPracticeTestScore({
            readingWritingCorrect: 67,
            mathCorrect: 20,
          }).success,
        ).toBe(false);
      },
    );

    it(
      "rejects Math scores above 54",
      () => {
        expect(
          safeCalculateSatPracticeTestScore({
            readingWritingCorrect: 40,
            mathCorrect: 55,
          }).success,
        ).toBe(false);
      },
    );

    it(
      "rejects fractional and non-finite values",
      () => {
        expect(
          safeCalculateSatPracticeTestScore({
            readingWritingCorrect: 40.5,
            mathCorrect: 20,
          }).success,
        ).toBe(false);

        expect(
          safeCalculateSatPracticeTestScore({
            readingWritingCorrect: 40,
            mathCorrect:
              Number.NaN,
          }).success,
        ).toBe(false);
      },
    );
  },
);
