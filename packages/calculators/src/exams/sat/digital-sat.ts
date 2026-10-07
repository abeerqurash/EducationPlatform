import type {
  ExamRangeDataset,
} from "../range-dataset";

import {
  getScoreRange,
} from "../range-scoring";

import {
  DIGITAL_SAT_ESTIMATION_DATASET,
} from "./digital-sat-estimation-dataset";

import type {
  DigitalSatEstimateResult,
  DigitalSatInput,
  DigitalSatSafeResult,
} from "./digital-sat-types";

import {
  validateDigitalSatInput,
} from "./digital-sat-validation";

function getSectionDataset(
  dataset: ExamRangeDataset,
  sectionId: string,
) {
  const section =
    dataset.sections.find(
      (candidate) =>
        candidate.sectionId ===
        sectionId,
    );

  if (!section) {
    throw new Error(
      `Scoring dataset is missing section "${sectionId}".`,
    );
  }

  return section;
}

function validateDataset(
  dataset: ExamRangeDataset,
) {
  if (
    dataset.metadata.examId !==
    "digital-sat"
  ) {
    throw new Error(
      "The supplied scoring dataset does not belong to the Digital SAT.",
    );
  }

  for (
    const section
    of dataset.sections
  ) {
    if (
      section.rows.length !==
      section.maximumRawScore + 1
    ) {
      throw new Error(
        `Dataset section "${section.sectionId}" is incomplete.`,
      );
    }

    for (
      let rawScore = 0;
      rawScore <=
      section.maximumRawScore;
      rawScore += 1
    ) {
      const row =
        section.rows.find(
          (candidate) =>
            candidate.rawScore ===
            rawScore,
        );

      if (!row) {
        throw new Error(
          `Dataset section "${section.sectionId}" is missing raw score ${rawScore}.`,
        );
      }

      if (
        row.score.min < 200 ||
        row.score.max > 800 ||
        row.score.min >
          row.score.max
      ) {
        throw new Error(
          `Dataset section "${section.sectionId}" contains an invalid score range.`,
        );
      }
    }
  }
}

export function calculateDigitalSatEstimate(
  input: DigitalSatInput,

  dataset:
    ExamRangeDataset =
      DIGITAL_SAT_ESTIMATION_DATASET,
): DigitalSatEstimateResult {
  const errors =
    validateDigitalSatInput(
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

  validateDataset(dataset);

  const readingWritingCorrect =
    input.readingWritingModule1Correct +
    input.readingWritingModule2Correct;

  const mathCorrect =
    input.mathModule1Correct +
    input.mathModule2Correct;

  const readingWritingDataset =
    getSectionDataset(
      dataset,
      "reading-writing",
    );

  const mathDataset =
    getSectionDataset(
      dataset,
      "math",
    );

  const readingWritingScore =
    getScoreRange(
      readingWritingDataset,
      readingWritingCorrect,
    );

  const mathScore =
    getScoreRange(
      mathDataset,
      mathCorrect,
    );

  const totalMin =
    readingWritingScore.min +
    mathScore.min;

  const totalMax =
    readingWritingScore.max +
    mathScore.max;

  return {
    readingWriting: {
      correct:
        readingWritingCorrect,

      maximumCorrect: 54,

      estimatedScore:
        readingWritingScore,
    },

    math: {
      correct:
        mathCorrect,

      maximumCorrect: 44,

      estimatedScore:
        mathScore,
    },

    totalCorrect:
      readingWritingCorrect +
      mathCorrect,

    totalQuestions: 98,

    estimatedTotalScore: {
      min: Math.max(
        400,
        totalMin,
      ),

      max: Math.min(
        1600,
        totalMax,
      ),
    },

    dataset: {
      id:
        dataset.metadata.id,

      version:
        dataset.metadata.version,

      sourceType:
        dataset.metadata.sourceType,

      sourceName:
        dataset.metadata.sourceName,
    },

    isOfficialScore: false,

    disclaimer:
      "This is an estimated score range, not an official College Board SAT score. Official Digital SAT scoring depends on adaptive routing, question characteristics, and the specific questions answered.",
  };
}

export function safeCalculateDigitalSatEstimate(
  input: DigitalSatInput,

  dataset:
    ExamRangeDataset =
      DIGITAL_SAT_ESTIMATION_DATASET,
): DigitalSatSafeResult {
  const errors =
    validateDigitalSatInput(
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
      calculateDigitalSatEstimate(
        input,
        dataset,
      ),

    errors: [],
  };
}