import { roundDecimal } from "./precision";

export type GPACourseInput = {
  name: string;
  credits: number;
  gradePoints: number;
};

export type GPACalculationResult = {
  gpa: number;
  totalCredits: number;
  totalQualityPoints: number;
  courseCount: number;
};

export type GPAValidationError = {
  courseIndex?: number;
  field:
    | "courses"
    | "credits"
    | "gradePoints";
  message: string;
};

export type GPAValidationResult =
  | {
      success: true;
      data: GPACalculationResult;
      errors: [];
    }
  | {
      success: false;
      data: null;
      errors: GPAValidationError[];
    };

const MAX_COURSES = 100;
const MAX_CREDITS_PER_COURSE = 100;
const MAX_TOTAL_CREDITS = 10000;

export function validateGPAInputs(
  courses: GPACourseInput[],
): GPAValidationError[] {
  const errors:
    GPAValidationError[] = [];

  if (courses.length === 0) {
    errors.push({
      field: "courses",
      message:
        "Add at least one course.",
    });

    return errors;
  }

  if (
    courses.length >
    MAX_COURSES
  ) {
    errors.push({
      field: "courses",
      message:
        `A maximum of ${MAX_COURSES} courses can be calculated at once.`,
    });
  }

  let totalCredits = 0;

  courses.forEach(
    (course, courseIndex) => {
      if (
        !Number.isFinite(
          course.credits,
        ) ||
        course.credits <= 0 ||
        course.credits >
          MAX_CREDITS_PER_COURSE
      ) {
        errors.push({
          courseIndex,
          field: "credits",
          message:
            `Course ${courseIndex + 1}: credits must be greater than 0 and no more than ${MAX_CREDITS_PER_COURSE}.`,
        });
      } else {
        totalCredits +=
          course.credits;
      }

      if (
        !Number.isFinite(
          course.gradePoints,
        ) ||
        course.gradePoints < 0 ||
        course.gradePoints > 4
      ) {
        errors.push({
          courseIndex,
          field: "gradePoints",
          message:
            `Course ${courseIndex + 1}: grade points must be between 0.0 and 4.0.`,
        });
      }
    },
  );

  if (
    totalCredits >
    MAX_TOTAL_CREDITS
  ) {
    errors.push({
      field: "credits",
      message:
        `Total credits cannot exceed ${MAX_TOTAL_CREDITS}.`,
    });
  }

  return errors;
}

export function calculateGPA(
  courses: GPACourseInput[],
): GPACalculationResult {
  const errors =
    validateGPAInputs(courses);

  if (errors.length > 0) {
    throw new Error(
      errors
        .map(
          (error) =>
            error.message,
        )
        .join(" "),
    );
  }

  let totalCredits = 0;
  let totalQualityPoints = 0;

  for (const course of courses) {
    totalCredits +=
      course.credits;

    totalQualityPoints +=
      course.credits *
      course.gradePoints;
  }

  const gpa =
    totalQualityPoints /
    totalCredits;

  return {
    gpa: roundDecimal(gpa, 3),
    totalCredits: roundDecimal(
      totalCredits,
      2,
    ),
    totalQualityPoints:
      roundDecimal(
        totalQualityPoints,
        3,
      ),
    courseCount:
      courses.length,
  };
}

export function safeCalculateGPA(
  courses: GPACourseInput[],
): GPAValidationResult {
  const errors =
    validateGPAInputs(courses);

  if (errors.length > 0) {
    return {
      success: false,
      data: null,
      errors,
    };
  }

  return {
    success: true,
    data: calculateGPA(
      courses,
    ),
    errors: [],
  };
}