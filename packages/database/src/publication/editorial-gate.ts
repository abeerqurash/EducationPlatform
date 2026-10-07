export type EditorialVerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected"
  | "outdated";

export type EditorialReviewStatus =
  | "pending"
  | "approved"
  | "changes_requested"
  | "rejected";

export type EditorialPublicationStatus =
  | "draft"
  | "review"
  | "scheduled"
  | "published"
  | "archived";

export type EditorialGateInput = {
  toolStatus:
    EditorialPublicationStatus;

  calculatorVerificationStatus:
    EditorialVerificationStatus;

  formulaVerificationStatus?:
    EditorialVerificationStatus | null;

  sourceVerificationStatuses:
    EditorialVerificationStatus[];

  latestReviewStatus?:
    EditorialReviewStatus | null;

  latestReviewReviewedAt?:
    Date | null;

  requireFormula?: boolean;
  requireVerifiedSource?: boolean;
};

export type EditorialGateIssueCode =
  | "TOOL_NOT_IN_REVIEW"
  | "CALCULATOR_NOT_VERIFIED"
  | "FORMULA_MISSING"
  | "FORMULA_NOT_VERIFIED"
  | "VERIFIED_SOURCE_MISSING"
  | "APPROVED_REVIEW_MISSING"
  | "APPROVED_REVIEW_DATE_MISSING";

export type EditorialGateIssue = {
  code: EditorialGateIssueCode;
  message: string;
};

export type EditorialGateResult = {
  canPublish: boolean;
  issues: EditorialGateIssue[];
};

function issue(
  code: EditorialGateIssueCode,
  message: string,
): EditorialGateIssue {
  return {
    code,
    message,
  };
}

/**
 * Strict editorial gate used before a calculator may be promoted
 * from review to published.
 *
 * This function never changes database state and never auto-verifies
 * a source, formula, calculator version or review.
 */
export function evaluateEditorialPublicationGate(
  input: EditorialGateInput,
): EditorialGateResult {
  const issues:
    EditorialGateIssue[] = [];

  if (
    input.toolStatus !== "review"
  ) {
    issues.push(
      issue(
        "TOOL_NOT_IN_REVIEW",
        "The tool must be in review before it can be published.",
      ),
    );
  }

  if (
    input.calculatorVerificationStatus !==
    "verified"
  ) {
    issues.push(
      issue(
        "CALCULATOR_NOT_VERIFIED",
        "The active calculator version must be verified before publication.",
      ),
    );
  }

  const requireFormula =
    input.requireFormula ?? true;

  if (requireFormula) {
    if (
      input.formulaVerificationStatus ==
      null
    ) {
      issues.push(
        issue(
          "FORMULA_MISSING",
          "A formula version is required for this calculator before publication.",
        ),
      );
    } else if (
      input.formulaVerificationStatus !==
      "verified"
    ) {
      issues.push(
        issue(
          "FORMULA_NOT_VERIFIED",
          "The active formula version must be verified before publication.",
        ),
      );
    }
  }

  const requireVerifiedSource =
    input.requireVerifiedSource ?? true;

  if (
    requireVerifiedSource &&
    !input.sourceVerificationStatuses.some(
      (status) =>
        status === "verified",
    )
  ) {
    issues.push(
      issue(
        "VERIFIED_SOURCE_MISSING",
        "At least one linked source must be verified before publication.",
      ),
    );
  }

  if (
    input.latestReviewStatus !==
    "approved"
  ) {
    issues.push(
      issue(
        "APPROVED_REVIEW_MISSING",
        "An approved editorial review is required before publication.",
      ),
    );
  } else if (
    !input.latestReviewReviewedAt
  ) {
    issues.push(
      issue(
        "APPROVED_REVIEW_DATE_MISSING",
        "The approved editorial review must include a review timestamp.",
      ),
    );
  }

  return {
    canPublish:
      issues.length === 0,
    issues,
  };
}
