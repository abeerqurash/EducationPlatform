import { roundDecimal } from "./precision";

export type FinalGradeInput = {
  currentGrade: number;
  completedWeight: number;
  desiredGrade: number;
};

export type FinalGradeStatus =
  | "achievable"
  | "already-secured"
  | "above-normal-range";

export type FinalGradeCalculationResult = {
  requiredFinalGrade: number;
  finalWeight: number;
  currentContribution: number;
  requiredContribution: number;
  maximumOverallGrade: number;
  status: FinalGradeStatus;
};

export type FinalGradeValidationError = {
  field:
    | "currentGrade"
    | "completedWeight"
    | "desiredGrade";

  message: string;
};

export type FinalGradeValidationResult =
  | {
      success: true;
      data:
        FinalGradeCalculationResult;
      errors: [];
    }
  | {
      success: false;
      data: null;
      errors:
        FinalGradeValidationError[];
    };

export function validateFinalGradeInput(
  input: FinalGradeInput,
): FinalGradeValidationError[] {
  const errors:
    FinalGradeValidationError[] =
    [];

  if (
    !Number.isFinite(
      input.currentGrade,
    ) ||
    input.currentGrade < 0 ||
    input.currentGrade > 100
  ) {
    errors.push({
      field:
        "currentGrade",

      message:
        "Current grade must be between 0 and 100.",
    });
  }

  if (
    !Number.isFinite(
      input.completedWeight,
    ) ||
    input.completedWeight < 0 ||
    input.completedWeight >= 100
  ) {
    errors.push({
      field:
        "completedWeight",

      message:
        "Completed course weight must be at least 0 and less than 100.",
    });
  }

  if (
    !Number.isFinite(
      input.desiredGrade,
    ) ||
    input.desiredGrade < 0 ||
    input.desiredGrade > 100
  ) {
    errors.push({
      field:
        "desiredGrade",

      message:
        "Desired overall grade must be between 0 and 100.",
    });
  }

  return errors;
}

export function calculateFinalGrade(
  input: FinalGradeInput,
): FinalGradeCalculationResult {
  const errors =
    validateFinalGradeInput(
      input,
    );

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

  const completedFraction =
    input.completedWeight / 100;

  const finalWeight =
    100 -
    input.completedWeight;

  const finalFraction =
    finalWeight / 100;

  const currentContribution =
    input.currentGrade *
    completedFraction;

  const requiredContribution =
    input.desiredGrade -
    currentContribution;

  const requiredFinalGrade =
    requiredContribution /
    finalFraction;

  const maximumOverallGrade =
    currentContribution +
    100 * finalFraction;

  let status:
    FinalGradeStatus =
    "achievable";

  if (
    requiredFinalGrade <= 0
  ) {
    status =
      "already-secured";
  } else if (
    requiredFinalGrade > 100
  ) {
    status =
      "above-normal-range";
  }

  return {
    requiredFinalGrade:
      roundDecimal(
        requiredFinalGrade,
        3,
      ),

    finalWeight:
      roundDecimal(
        finalWeight,
        3,
      ),

    currentContribution:
      roundDecimal(
        currentContribution,
        3,
      ),

    requiredContribution:
      roundDecimal(
        requiredContribution,
        3,
      ),

    maximumOverallGrade:
      roundDecimal(
        maximumOverallGrade,
        3,
      ),

    status,
  };
}

export function safeCalculateFinalGrade(
  input: FinalGradeInput,
): FinalGradeValidationResult {
  const errors =
    validateFinalGradeInput(
      input,
    );

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
      calculateFinalGrade(
        input,
      ),

    errors: [],
  };
}