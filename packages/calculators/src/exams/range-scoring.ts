import type {
  ExamScoreRange,
} from "./types";

import type {
  SectionRangeDataset,
} from "./range-dataset";

export function getScoreRange(
  dataset:
    SectionRangeDataset,

  rawScore: number,
): ExamScoreRange {
  if (
    !Number.isInteger(rawScore)
  ) {
    throw new Error(
      "Raw score must be an integer.",
    );
  }

  if (
    rawScore < 0 ||
    rawScore >
      dataset.maximumRawScore
  ) {
    throw new Error(
      `Raw score must be between 0 and ${dataset.maximumRawScore}.`,
    );
  }

  const row =
    dataset.rows.find(
      (candidate) =>
        candidate.rawScore ===
        rawScore,
    );

  if (!row) {
    throw new Error(
      `No scoring row exists for raw score ${rawScore}.`,
    );
  }

  return {
    min: row.score.min,
    max: row.score.max,
  };
}