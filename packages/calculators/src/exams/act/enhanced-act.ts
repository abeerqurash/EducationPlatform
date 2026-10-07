import {
  roundHalfUp,
} from "../../precision";

import {
  type EnhancedActCompositeInput,
  type EnhancedActCompositeResult,
  type EnhancedActSafeResult,
  type EnhancedActSuperscoreAttempt,
  type EnhancedActSuperscoreResult,
  type EnhancedActValidationError,
} from "./enhanced-act-types";

function validateSectionScore(
  value: number | undefined,
  field:
    EnhancedActValidationError["field"],
  label: string,
  optional = false,
): EnhancedActValidationError | null {
  if (
    optional &&
    value === undefined
  ) {
    return null;
  }

  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return {
      field,
      message:
        `${label} score must be a finite number.`,
    };
  }

  if (!Number.isInteger(value)) {
    return {
      field,
      message:
        `${label} score must be a whole number.`,
    };
  }

  if (
    value < 1 ||
    value > 36
  ) {
    return {
      field,
      message:
        `${label} score must be between 1 and 36.`,
    };
  }

  return null;
}

export function validateEnhancedActCompositeInput(
  input:
    EnhancedActCompositeInput,
): EnhancedActValidationError[] {
  const errors:
    EnhancedActValidationError[] =
    [];

  const checks = [
    validateSectionScore(
      input.english,
      "english",
      "English",
    ),
    validateSectionScore(
      input.math,
      "math",
      "Math",
    ),
    validateSectionScore(
      input.reading,
      "reading",
      "Reading",
    ),
    validateSectionScore(
      input.science,
      "science",
      "Science",
      true,
    ),
  ];

  for (const error of checks) {
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

/**
 * ACT's enhanced Composite is the average of English, Math,
 * and Reading section scores, rounded to the nearest whole
 * number. Science is optional and is not part of Composite.
 *
 * ACT specifies that fractions of one-half or more round up.
 * Our shared half-up precision utility matches that rule.
 */
export function calculateEnhancedActComposite(
  input:
    EnhancedActCompositeInput,
): EnhancedActCompositeResult {
  const errors =
    validateEnhancedActCompositeInput(
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

  const composite =
    roundHalfUp(
      (
        input.english +
        input.math +
        input.reading
      ) / 3,
      0,
    );

  const science =
    input.science ??
    null;

  const stem =
    science === null
      ? null
      : roundHalfUp(
          (
            input.math +
            science
          ) / 2,
          0,
        );

  return {
    english:
      input.english,
    math:
      input.math,
    reading:
      input.reading,
    science,
    composite,
    stem,
    compositeSections: [
      "english",
      "math",
      "reading",
    ],
    scienceIncludedInComposite:
      false,
    scoringVersion:
      "enhanced-act-2025-plus",
  };
}

export function safeCalculateEnhancedActComposite(
  input:
    EnhancedActCompositeInput,
): EnhancedActSafeResult {
  const errors =
    validateEnhancedActCompositeInput(
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
      calculateEnhancedActComposite(
        input,
      ),
    errors: [],
  };
}

export function calculateEnhancedActSuperscore(
  attempts:
    readonly EnhancedActSuperscoreAttempt[],
): EnhancedActSuperscoreResult {
  if (attempts.length === 0) {
    throw new Error(
      "Add at least one ACT attempt.",
    );
  }

  attempts.forEach(
    (attempt, index) => {
      const errors =
        validateEnhancedActCompositeInput(
          attempt,
        );

      if (errors.length > 0) {
        throw new Error(
          `Attempt ${index + 1}: ${errors
            .map(
              (error) =>
                error.message,
            )
            .join(" ")}`,
        );
      }
    },
  );

  const english =
    Math.max(
      ...attempts.map(
        (attempt) =>
          attempt.english,
      ),
    );

  const math =
    Math.max(
      ...attempts.map(
        (attempt) =>
          attempt.math,
      ),
    );

  const reading =
    Math.max(
      ...attempts.map(
        (attempt) =>
          attempt.reading,
      ),
    );

  const scienceScores =
    attempts
      .map(
        (attempt) =>
          attempt.science,
      )
      .filter(
        (
          score,
        ): score is number =>
          score !== undefined,
      );

  const science =
    scienceScores.length > 0
      ? Math.max(
          ...scienceScores,
        )
      : null;

  const composite =
    roundHalfUp(
      (
        english +
        math +
        reading
      ) / 3,
      0,
    );

  const stem =
    science === null
      ? null
      : roundHalfUp(
          (
            math +
            science
          ) / 2,
          0,
        );

  return {
    english,
    math,
    reading,
    science,
    composite,
    stem,
    attemptCount:
      attempts.length,
    scoringVersion:
      "enhanced-act-2025-plus",
  };
}
