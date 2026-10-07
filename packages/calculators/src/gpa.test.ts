import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateGPA,
  safeCalculateGPA,
} from "./gpa";

describe("GPA calculator", () => {
  it("calculates a known weighted GPA", () => {
    const result =
      calculateGPA([
        {
          name: "Course 1",
          credits: 3,
          gradePoints: 4,
        },
        {
          name: "Course 2",
          credits: 3,
          gradePoints: 3,
        },
        {
          name: "Course 3",
          credits: 3,
          gradePoints: 2,
        },
      ]);

    expect(result.gpa).toBe(3);
    expect(
      result.totalCredits,
    ).toBe(9);

    expect(
      result.totalQualityPoints,
    ).toBe(27);
  });

  it("weights courses by credits", () => {
    const result =
      calculateGPA([
        {
          name: "Course 1",
          credits: 4,
          gradePoints: 4,
        },
        {
          name: "Course 2",
          credits: 2,
          gradePoints: 2,
        },
      ]);

    expect(result.gpa).toBe(
      3.333,
    );

    expect(
      result.totalCredits,
    ).toBe(6);

    expect(
      result.totalQualityPoints,
    ).toBe(20);
  });

  it("supports decimal credits", () => {
    const result =
      calculateGPA([
        {
          name: "Course 1",
          credits: 2.5,
          gradePoints: 4,
        },
        {
          name: "Course 2",
          credits: 1.5,
          gradePoints: 3,
        },
      ]);

    expect(
      result.totalCredits,
    ).toBe(4);

    expect(
      result.totalQualityPoints,
    ).toBe(14.5);

    expect(result.gpa).toBe(
      3.625,
    );
  });

  it("rejects zero credits", () => {
    const result =
      safeCalculateGPA([
        {
          name: "Course",
          credits: 0,
          gradePoints: 4,
        },
      ]);

    expect(
      result.success,
    ).toBe(false);
  });

  it("rejects negative credits", () => {
    const result =
      safeCalculateGPA([
        {
          name: "Course",
          credits: -3,
          gradePoints: 4,
        },
      ]);

    expect(
      result.success,
    ).toBe(false);
  });

  it("rejects grade points above 4", () => {
    const result =
      safeCalculateGPA([
        {
          name: "Course",
          credits: 3,
          gradePoints: 4.5,
        },
      ]);

    expect(
      result.success,
    ).toBe(false);
  });

  it("rejects non-finite values", () => {
    const result =
      safeCalculateGPA([
        {
          name: "Course",
          credits: Number.NaN,
          gradePoints: 4,
        },
      ]);

    expect(
      result.success,
    ).toBe(false);
  });

  it("rejects an empty course list", () => {
    const result =
      safeCalculateGPA([]);

    expect(
      result.success,
    ).toBe(false);
  });
});