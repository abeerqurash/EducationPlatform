import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateGrade,
  safeCalculateGrade,
} from "./grade";

describe(
  "Grade calculator",
  () => {
    it(
      "calculates total points and percentage",
      () => {
        const result =
          calculateGrade([
            {
              name:
                "Assignment 1",
              earnedPoints: 45,
              possiblePoints: 50,
            },
            {
              name:
                "Assignment 2",
              earnedPoints: 80,
              possiblePoints: 100,
            },
          ]);

        expect(
          result.totalEarnedPoints,
        ).toBe(125);

        expect(
          result.totalPossiblePoints,
        ).toBe(150);

        expect(
          result.percentage,
        ).toBe(83.333);

        expect(
          result.letterGrade,
        ).toBe("B");
      },
    );

    it(
      "uses total points rather than averaging row percentages",
      () => {
        const result =
          calculateGrade([
            {
              name: "Small",
              earnedPoints: 10,
              possiblePoints: 10,
            },
            {
              name: "Large",
              earnedPoints: 50,
              possiblePoints: 100,
            },
          ]);

        expect(
          result.percentage,
        ).toBe(54.545);
      },
    );

    it(
      "handles a perfect score",
      () => {
        const result =
          calculateGrade([
            {
              name: "Exam",
              earnedPoints: 100,
              possiblePoints: 100,
            },
          ]);

        expect(
          result.percentage,
        ).toBe(100);

        expect(
          result.letterGrade,
        ).toBe("A");
      },
    );

    it(
      "rejects earned points above possible points",
      () => {
        const result =
          safeCalculateGrade([
            {
              name: "Exam",
              earnedPoints: 101,
              possiblePoints: 100,
            },
          ]);

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "rejects zero possible points",
      () => {
        const result =
          safeCalculateGrade([
            {
              name: "Exam",
              earnedPoints: 0,
              possiblePoints: 0,
            },
          ]);

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "rejects negative earned points",
      () => {
        const result =
          safeCalculateGrade([
            {
              name: "Exam",
              earnedPoints: -1,
              possiblePoints: 100,
            },
          ]);

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "rejects non-finite values",
      () => {
        const result =
          safeCalculateGrade([
            {
              name: "Exam",
              earnedPoints:
                Number.NaN,
              possiblePoints: 100,
            },
          ]);

        expect(
          result.success,
        ).toBe(false);
      },
    );

    it(
      "rejects an empty item list",
      () => {
        expect(
          safeCalculateGrade([])
            .success,
        ).toBe(false);
      },
    );
  },
);