export type EnhancedActCompositeInput = {
  english: number;
  math: number;
  reading: number;
  science?: number;
};

export type EnhancedActCompositeResult = {
  english: number;
  math: number;
  reading: number;
  science: number | null;
  composite: number;
  stem: number | null;
  compositeSections:
    readonly [
      "english",
      "math",
      "reading",
    ];
  scienceIncludedInComposite:
    false;
  scoringVersion:
    "enhanced-act-2025-plus";
};

export type EnhancedActValidationError = {
  field:
    | "english"
    | "math"
    | "reading"
    | "science";
  message: string;
};

export type EnhancedActSafeResult =
  | {
      success: true;
      data:
        EnhancedActCompositeResult;
      errors: [];
    }
  | {
      success: false;
      data: null;
      errors:
        EnhancedActValidationError[];
    };

export type EnhancedActSuperscoreAttempt = {
  english: number;
  math: number;
  reading: number;
  science?: number;
};

export type EnhancedActSuperscoreResult = {
  english: number;
  math: number;
  reading: number;
  science: number | null;
  composite: number;
  stem: number | null;
  attemptCount: number;
  scoringVersion:
    "enhanced-act-2025-plus";
};
