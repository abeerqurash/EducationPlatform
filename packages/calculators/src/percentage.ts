import { roundDecimal } from "./precision";

export type PercentageInput = {
  part: number;
  whole: number;
};

export type PercentageResult = {
  percentage: number;
  part: number;
  whole: number;
};

export type PercentageValidationError = {
  field: "part" | "whole";
  message: string;
};

export type PercentageValidationResult =
  | {
      success: true;
      data: PercentageResult;
      errors: [];
    }
  | {
      success: false;
      data: null;
      errors: PercentageValidationError[];
    };

const MAX_ABSOLUTE_VALUE =
  1_000_000_000_000;

export function validatePercentageInput(
  input: PercentageInput,
): PercentageValidationError[] {
  const errors:
    PercentageValidationError[] =
    [];

  if (
    !Number.isFinite(
      input.part,
    )
  ) {
    errors.push({
      field: "part",
      message:
        "Part must be a finite number.",
    });
  } else if (
    Math.abs(input.part) >
    MAX_ABSOLUTE_VALUE
  ) {
    errors.push({
      field: "part",
      message:
        `Part cannot exceed ${MAX_ABSOLUTE_VALUE} in absolute value.`,
    });
  }

  if (
    !Number.isFinite(
      input.whole,
    )
  ) {
    errors.push({
      field: "whole",
      message:
        "Whole must be a finite number.",
    });
  } else if (
    input.whole === 0
  ) {
    errors.push({
      field: "whole",
      message:
        "Whole cannot be zero.",
    });
  } else if (
    Math.abs(input.whole) >
    MAX_ABSOLUTE_VALUE
  ) {
    errors.push({
      field: "whole",
      message:
        `Whole cannot exceed ${MAX_ABSOLUTE_VALUE} in absolute value.`,
    });
  }

  return errors;
}

export function calculatePercentage(
  input: PercentageInput,
): PercentageResult {
  const errors =
    validatePercentageInput(
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

  const percentage =
    (input.part /
      input.whole) *
    100;

  if (
    !Number.isFinite(
      percentage,
    )
  ) {
    throw new Error(
      "The percentage result is outside the supported numeric range.",
    );
  }

  return {
    percentage:
      roundDecimal(
        percentage,
        6,
      ),

    part: input.part,
    whole: input.whole,
  };
}

export function safeCalculatePercentage(
  input: PercentageInput,
): PercentageValidationResult {
  const errors =
    validatePercentageInput(
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
      calculatePercentage(
        input,
      ),
    errors: [],
  };
}