import type {
  PublicCalculatorRecord,
} from "../repositories/public-tools";

export type CalculatorReadinessLevel =
  | "development"
  | "publishable"
  | "verified";

export type CalculatorReadinessIssueCode =
  | "TOOL_NOT_PUBLISHED"
  | "CALCULATOR_INACTIVE"
  | "FORMULA_MISSING"
  | "FORMULA_INACTIVE"
  | "METHODOLOGY_MISSING"
  | "VERSION_MISMATCH"
  | "CALCULATOR_UNVERIFIED"
  | "FORMULA_UNVERIFIED"
  | "SOURCE_MISSING"
  | "SOURCE_UNVERIFIED"
  | "REVIEW_MISSING"
  | "REVIEW_NOT_APPROVED";

export type CalculatorReadinessIssue = {
  code:
    CalculatorReadinessIssueCode;

  severity:
    | "error"
    | "warning";

  message: string;
};

export type CalculatorPublicationReadiness = {
  level:
    CalculatorReadinessLevel;

  developmentVisible: boolean;

  publishable: boolean;

  verified: boolean;

  issues:
    CalculatorReadinessIssue[];
};

function hasText(
  value:
    | string
    | null
    | undefined,
) {
  return Boolean(
    value?.trim(),
  );
}

export function evaluateCalculatorPublication(
  calculator:
    PublicCalculatorRecord,
): CalculatorPublicationReadiness {
  const issues:
    CalculatorReadinessIssue[] =
    [];

  if (
    calculator.tool.status !==
    "published"
  ) {
    issues.push({
      code:
        "TOOL_NOT_PUBLISHED",

      severity: "error",

      message:
        "The tool is not published.",
    });
  }

  if (
    !calculator.calculatorVersion
      .isActive
  ) {
    issues.push({
      code:
        "CALCULATOR_INACTIVE",

      severity: "error",

      message:
        "The calculator version is not active.",
    });
  }

  if (
    !calculator.formulaVersion
  ) {
    issues.push({
      code:
        "FORMULA_MISSING",

      severity: "error",

      message:
        "The calculator does not have an active formula version.",
    });
  } else if (
    !calculator.formulaVersion
      .isActive
  ) {
    issues.push({
      code:
        "FORMULA_INACTIVE",

      severity: "error",

      message:
        "The formula version is not active.",
    });
  }

  if (
    !hasText(
      calculator.calculatorVersion
        .methodology,
    )
  ) {
    issues.push({
      code:
        "METHODOLOGY_MISSING",

      severity: "error",

      message:
        "Calculator methodology is missing.",
    });
  }

  if (
    calculator.tool
      .currentVersion !==
    calculator.calculatorVersion
      .version
  ) {
    issues.push({
      code:
        "VERSION_MISMATCH",

      severity: "error",

      message:
        "The tool current version does not match the active calculator version.",
    });
  }

  if (
    calculator.calculatorVersion
      .verificationStatus !==
    "verified"
  ) {
    issues.push({
      code:
        "CALCULATOR_UNVERIFIED",

      severity: "warning",

      message:
        "The calculator version has not been verified.",
    });
  }

  if (
    calculator.formulaVersion &&
    calculator.formulaVersion
      .verificationStatus !==
      "verified"
  ) {
    issues.push({
      code:
        "FORMULA_UNVERIFIED",

      severity: "warning",

      message:
        "The formula version has not been verified.",
    });
  }

  if (
    calculator.sources.length ===
    0
  ) {
    issues.push({
      code:
        "SOURCE_MISSING",

      severity: "warning",

      message:
        "No calculator source has been linked.",
    });
  } else if (
    !calculator.sources.some(
      (source) =>
        source.verificationStatus ===
        "verified",
    )
  ) {
    issues.push({
      code:
        "SOURCE_UNVERIFIED",

      severity: "warning",

      message:
        "No linked calculator source has been verified.",
    });
  }

  if (
    !calculator.latestReview
  ) {
    issues.push({
      code:
        "REVIEW_MISSING",

      severity: "warning",

      message:
        "The calculator version has not received a review.",
    });
  } else if (
    calculator.latestReview
      .status !== "approved"
  ) {
    issues.push({
      code:
        "REVIEW_NOT_APPROVED",

      severity: "warning",

      message:
        "The latest calculator review is not approved.",
    });
  }

  const hasErrors =
    issues.some(
      (issue) =>
        issue.severity ===
        "error",
    );

  const hasVerificationWarnings =
    issues.some(
      (issue) =>
        issue.severity ===
        "warning",
    );

  const developmentVisible =
    calculator.tool.status ===
      "published" &&
    calculator.calculatorVersion
      .isActive &&
    Boolean(
      calculator.formulaVersion
        ?.isActive,
    );

  const publishable =
    developmentVisible &&
    !hasErrors;

  const verified =
    publishable &&
    !hasVerificationWarnings;

  let level:
    CalculatorReadinessLevel =
    "development";

  if (verified) {
    level = "verified";
  } else if (publishable) {
    level = "publishable";
  }

  return {
    level,
    developmentVisible,
    publishable,
    verified,
    issues,
  };
}