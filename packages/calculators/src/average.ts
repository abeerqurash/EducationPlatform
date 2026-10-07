import { roundDecimal } from "./precision";

export type AverageCalculationResult = {
  average: number;
  sum: number;
  count: number;
  minimum: number;
  maximum: number;
};

export type AverageValidationError = {
  valueIndex?: number;

  field:
    | "values"
    | "value";

  message: string;
};

export type AverageValidationResult =
  | {
      success: true;
      data:
        AverageCalculationResult;
      errors: [];
    }
  | {
      success: false;
      data: null;
      errors:
        AverageValidationError[];
    };

export const MAX_AVERAGE_VALUES =
  1000;

const MAX_ABSOLUTE_VALUE =
  1_000_000_000_000;

export function validateAverageInputs(
  values: number[],
): AverageValidationError[] {
  const errors:
    AverageValidationError[] =
    [];

  if (values.length === 0) {
    errors.push({
      field: "values",
      message:
        "Add at least one value.",
    });

    return errors;
  }

  if (
    values.length >
    MAX_AVERAGE_VALUES
  ) {
    errors.push({
      field: "values",

      message:
        `A maximum of ${MAX_AVERAGE_VALUES} values can be calculated at once.`,
    });
  }

  values.forEach(
    (value, valueIndex) => {
      if (
        !Number.isFinite(value)
      ) {
        errors.push({
          valueIndex,
          field: "value",

          message:
            `Value ${valueIndex + 1} must be a finite number.`,
        });

        return;
      }

      if (
        Math.abs(value) >
        MAX_ABSOLUTE_VALUE
      ) {
        errors.push({
          valueIndex,
          field: "value",

          message:
            `Value ${valueIndex + 1} cannot exceed ${MAX_ABSOLUTE_VALUE} in absolute value.`,
        });
      }
    },
  );

  return errors;
}

export function calculateAverage(
  values: number[],
): AverageCalculationResult {
  const errors =
    validateAverageInputs(
      values,
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

  let sum = 0;

  let minimum =
    values[0];

  let maximum =
    values[0];

  for (const value of values) {
    sum += value;

    if (value < minimum) {
      minimum = value;
    }

    if (value > maximum) {
      maximum = value;
    }
  }

  if (!Number.isFinite(sum)) {
    throw new Error(
      "The sum is outside the supported numeric range.",
    );
  }

  const average =
    sum / values.length;

  return {
    average:
      roundDecimal(average, 6),

    sum:
      roundDecimal(sum, 6),

    count:
      values.length,

    minimum,
    maximum,
  };
}

export function safeCalculateAverage(
  values: number[],
): AverageValidationResult {
  const errors =
    validateAverageInputs(
      values,
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
      calculateAverage(
        values,
      ),

    errors: [],
  };
}