import {
  SAT_PRACTICE_TEST_10_DATASET,
  type SatOfficialPracticeDataset,
  type SatOfficialPracticeScoreRangeRow,
} from "./practice-test-10-dataset";

export type SatPracticeTestScoreInput = {
  readingWritingCorrect: number;
  mathCorrect: number;
};

export type SatPracticeScoreRange = {
  min: number;
  max: number;
};

export type SatPracticeTestScoreResult = {
  practiceTest: number;
  scoringMode:
    "official-paper-practice-range";
  readingWritingRawScore: number;
  mathRawScore: number;
  readingWritingScore:
    SatPracticeScoreRange;
  mathScore:
    SatPracticeScoreRange;
  totalScore:
    SatPracticeScoreRange;
  dataset: {
    id: string;
    version: string;
    sourceType: "official";
    publisher: "College Board";
    sourceTitle: string;
    sourceUrl: string;
  };
  isOfficialPracticeConversion:
    true;
  isOfficialLiveSatScore:
    false;
  disclaimer: string;
};

export type SatPracticeTestValidationError = {
  field:
    | "readingWritingCorrect"
    | "mathCorrect";
  message: string;
};

export type SatPracticeTestSafeResult =
  | {
      success: true;
      data:
        SatPracticeTestScoreResult;
      errors: [];
    }
  | {
      success: false;
      data: null;
      errors:
        SatPracticeTestValidationError[];
    };

function validateIntegerRange(
  value: number,
  field:
    SatPracticeTestValidationError["field"],
  label: string,
  maximum: number,
): SatPracticeTestValidationError | null {
  if (!Number.isFinite(value)) {
    return {
      field,
      message:
        `${label} must be a finite number.`,
    };
  }

  if (!Number.isInteger(value)) {
    return {
      field,
      message:
        `${label} must be a whole number.`,
    };
  }

  if (
    value < 0 ||
    value > maximum
  ) {
    return {
      field,
      message:
        `${label} must be between 0 and ${maximum}.`,
    };
  }

  return null;
}

export function validateSatPracticeTestScoreInput(
  input:
    SatPracticeTestScoreInput,
  dataset:
    SatOfficialPracticeDataset =
      SAT_PRACTICE_TEST_10_DATASET,
): SatPracticeTestValidationError[] {
  const errors:
    SatPracticeTestValidationError[] =
    [];

  const readingWritingError =
    validateIntegerRange(
      input.readingWritingCorrect,
      "readingWritingCorrect",
      "Reading and Writing correct answers",
      dataset
        .readingWritingMaximumRawScore,
    );

  if (readingWritingError) {
    errors.push(
      readingWritingError,
    );
  }

  const mathError =
    validateIntegerRange(
      input.mathCorrect,
      "mathCorrect",
      "Math correct answers",
      dataset.mathMaximumRawScore,
    );

  if (mathError) {
    errors.push(mathError);
  }

  return errors;
}

function assertDataset(
  dataset:
    SatOfficialPracticeDataset,
) {
  if (
    dataset.readingWriting.length !==
    dataset
      .readingWritingMaximumRawScore +
      1
  ) {
    throw new Error(
      "Reading and Writing practice-test dataset is incomplete.",
    );
  }

  if (
    dataset.math.length !==
    dataset.mathMaximumRawScore + 1
  ) {
    throw new Error(
      "Math practice-test dataset is incomplete.",
    );
  }

  const validateRows = (
    rows:
      readonly SatOfficialPracticeScoreRangeRow[],
    maximum: number,
    label: string,
  ) => {
    rows.forEach(
      (row, index) => {
        if (
          row.rawScore !== index ||
          row.rawScore < 0 ||
          row.rawScore > maximum
        ) {
          throw new Error(
            `${label} practice-test dataset has an invalid raw-score row.`,
          );
        }

        if (
          row.min < 200 ||
          row.max > 800 ||
          row.min > row.max ||
          row.min % 10 !== 0 ||
          row.max % 10 !== 0
        ) {
          throw new Error(
            `${label} practice-test dataset has an invalid score range.`,
          );
        }
      },
    );
  };

  validateRows(
    dataset.readingWriting,
    dataset
      .readingWritingMaximumRawScore,
    "Reading and Writing",
  );

  validateRows(
    dataset.math,
    dataset.mathMaximumRawScore,
    "Math",
  );
}

function getRange(
  rows:
    readonly SatOfficialPracticeScoreRangeRow[],
  rawScore: number,
): SatPracticeScoreRange {
  const row =
    rows[rawScore];

  if (
    !row ||
    row.rawScore !== rawScore
  ) {
    throw new Error(
      `No score conversion exists for raw score ${rawScore}.`,
    );
  }

  return {
    min: row.min,
    max: row.max,
  };
}

export function calculateSatPracticeTestScore(
  input:
    SatPracticeTestScoreInput,
  dataset:
    SatOfficialPracticeDataset =
      SAT_PRACTICE_TEST_10_DATASET,
): SatPracticeTestScoreResult {
  assertDataset(dataset);

  const errors =
    validateSatPracticeTestScoreInput(
      input,
      dataset,
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

  const readingWritingScore =
    getRange(
      dataset.readingWriting,
      input.readingWritingCorrect,
    );

  const mathScore =
    getRange(
      dataset.math,
      input.mathCorrect,
    );

  return {
    practiceTest:
      dataset.practiceTest,
    scoringMode:
      dataset.scoringMode,
    readingWritingRawScore:
      input.readingWritingCorrect,
    mathRawScore:
      input.mathCorrect,
    readingWritingScore,
    mathScore,
    totalScore: {
      min:
        readingWritingScore.min +
        mathScore.min,
      max:
        readingWritingScore.max +
        mathScore.max,
    },
    dataset: {
      id: dataset.id,
      version:
        dataset.version,
      sourceType:
        dataset.sourceType,
      publisher:
        dataset.publisher,
      sourceTitle:
        dataset.sourceTitle,
      sourceUrl:
        dataset.sourceUrl,
    },
    isOfficialPracticeConversion:
      true,
    isOfficialLiveSatScore:
      false,
    disclaimer:
      "This result uses College Board's published conversion table for the paper version of SAT Practice Test #10. College Board describes paper-practice scoring as a simplified, slightly less precise version of actual SAT scoring. It is not an official score for a live adaptive SAT administration.",
  };
}

export function safeCalculateSatPracticeTestScore(
  input:
    SatPracticeTestScoreInput,
  dataset:
    SatOfficialPracticeDataset =
      SAT_PRACTICE_TEST_10_DATASET,
): SatPracticeTestSafeResult {
  const errors =
    validateSatPracticeTestScoreInput(
      input,
      dataset,
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
      calculateSatPracticeTestScore(
        input,
        dataset,
      ),
    errors: [],
  };
}
