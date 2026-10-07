import { roundDecimal } from "./precision";

export type GradeItemInput = {
  name: string;
  earnedPoints: number;
  possiblePoints: number;
};

export type GradeCalculationResult = {
  percentage: number;
  totalEarnedPoints: number;
  totalPossiblePoints: number;
  itemCount: number;
  letterGrade: string;
};

export type GradeValidationError = {
  itemIndex?: number;
  field:
    | "items"
    | "earnedPoints"
    | "possiblePoints";

  message: string;
};

export type GradeValidationResult =
  | {
      success: true;
      data: GradeCalculationResult;
      errors: [];
    }
  | {
      success: false;
      data: null;
      errors: GradeValidationError[];
    };

export const MAX_GRADE_ITEMS = 200;
export const MAX_POINTS_PER_ITEM = 1_000_000;
export const MAX_TOTAL_POINTS = 100_000_000;

export function percentageToLetterGrade(
  percentage: number,
): string {
  if (percentage >= 90) {
    return "A";
  }

  if (percentage >= 80) {
    return "B";
  }

  if (percentage >= 70) {
    return "C";
  }

  if (percentage >= 60) {
    return "D";
  }

  return "F";
}

export function validateGradeInputs(
  items: GradeItemInput[],
): GradeValidationError[] {
  const errors:
    GradeValidationError[] = [];

  if (items.length === 0) {
    errors.push({
      field: "items",
      message:
        "Add at least one graded item.",
    });

    return errors;
  }

  if (
    items.length >
    MAX_GRADE_ITEMS
  ) {
    errors.push({
      field: "items",
      message:
        `A maximum of ${MAX_GRADE_ITEMS} graded items can be calculated at once.`,
    });
  }

  let totalPossiblePoints = 0;

  items.forEach(
    (item, itemIndex) => {
      if (
        !Number.isFinite(
          item.possiblePoints,
        ) ||
        item.possiblePoints <= 0 ||
        item.possiblePoints >
          MAX_POINTS_PER_ITEM
      ) {
        errors.push({
          itemIndex,
          field:
            "possiblePoints",
          message:
            `Item ${itemIndex + 1}: possible points must be greater than 0 and no more than ${MAX_POINTS_PER_ITEM}.`,
        });
      } else {
        totalPossiblePoints +=
          item.possiblePoints;
      }

      if (
        !Number.isFinite(
          item.earnedPoints,
        ) ||
        item.earnedPoints < 0 ||
        item.earnedPoints >
          MAX_POINTS_PER_ITEM
      ) {
        errors.push({
          itemIndex,
          field:
            "earnedPoints",
          message:
            `Item ${itemIndex + 1}: earned points must be between 0 and ${MAX_POINTS_PER_ITEM}.`,
        });
      } else if (
        Number.isFinite(
          item.possiblePoints,
        ) &&
        item.possiblePoints > 0 &&
        item.earnedPoints >
          item.possiblePoints
      ) {
        errors.push({
          itemIndex,
          field:
            "earnedPoints",
          message:
            `Item ${itemIndex + 1}: earned points cannot exceed possible points.`,
        });
      }
    },
  );

  if (
    totalPossiblePoints >
    MAX_TOTAL_POINTS
  ) {
    errors.push({
      field:
        "possiblePoints",

      message:
        `Total possible points cannot exceed ${MAX_TOTAL_POINTS}.`,
    });
  }

  return errors;
}

export function calculateGrade(
  items: GradeItemInput[],
): GradeCalculationResult {
  const errors =
    validateGradeInputs(items);

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

  let totalEarnedPoints = 0;
  let totalPossiblePoints = 0;

  for (const item of items) {
    totalEarnedPoints +=
      item.earnedPoints;

    totalPossiblePoints +=
      item.possiblePoints;
  }

  const percentage =
    (totalEarnedPoints /
      totalPossiblePoints) *
    100;

  const roundedPercentage =
    roundDecimal(percentage, 3);

  return {
    percentage:
      roundedPercentage,

    totalEarnedPoints:
      roundDecimal(
        totalEarnedPoints,
        3,
      ),

    totalPossiblePoints:
      roundDecimal(
        totalPossiblePoints,
        3,
      ),

    itemCount:
      items.length,

    letterGrade:
      percentageToLetterGrade(
        roundedPercentage,
      ),
  };
}

export function safeCalculateGrade(
  items: GradeItemInput[],
): GradeValidationResult {
  const errors =
    validateGradeInputs(items);

  if (errors.length > 0) {
    return {
      success: false,
      data: null,
      errors,
    };
  }

  return {
    success: true,

    data:
      calculateGrade(items),

    errors: [],
  };
}