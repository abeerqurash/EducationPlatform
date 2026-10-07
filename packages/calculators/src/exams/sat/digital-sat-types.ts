import type {
  ExamScoreRange,
} from "../types";

export type DigitalSatInput = {
  readingWritingModule1Correct: number;
  readingWritingModule2Correct: number;

  mathModule1Correct: number;
  mathModule2Correct: number;
};

export type DigitalSatInputField =
  keyof DigitalSatInput;

export type DigitalSatValidationError = {
  field: DigitalSatInputField;

  message: string;
};

export type DigitalSatSectionResult = {
  correct: number;
  maximumCorrect: number;

  estimatedScore: ExamScoreRange;
};

export type DigitalSatEstimateResult = {
  readingWriting:
    DigitalSatSectionResult;

  math:
    DigitalSatSectionResult;

  totalCorrect: number;
  totalQuestions: number;

  estimatedTotalScore:
    ExamScoreRange;

  dataset: {
    id: string;
    version: string;
    sourceType:
      | "official"
      | "derived"
      | "estimated";
    sourceName: string;
  };

  isOfficialScore: false;

  disclaimer: string;
};

export type DigitalSatSafeResult =
  | {
      success: true;
      data:
        DigitalSatEstimateResult;
      errors: [];
    }
  | {
      success: false;
      data: null;
      errors:
        DigitalSatValidationError[];
    };