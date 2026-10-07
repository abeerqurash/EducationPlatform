import type {
  ExamRangeDataset,
  RawScoreRangeRow,
} from "../range-dataset";

/*
 * IMPORTANT
 * ---------
 *
 * This dataset is intentionally marked
 * ESTIMATED.
 *
 * It is NOT an official College Board
 * raw-score conversion table.
 *
 * Digital SAT official scoring uses
 * adaptive testing and item-response
 * characteristics. Therefore a student's
 * exact official score cannot be recovered
 * from correct-answer totals alone.
 *
 * These ranges provide a deterministic
 * development/estimation model while
 * preserving truthful score semantics.
 *
 * Future official practice-test-specific
 * datasets can be added independently
 * without changing the scoring engine.
 */

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

function roundToTen(
  value: number,
) {
  return Math.round(value / 10) * 10;
}

function createEstimatedRows(
  maximumRawScore: number,
): RawScoreRangeRow[] {
  const rows:
    RawScoreRangeRow[] = [];

  for (
    let rawScore = 0;
    rawScore <= maximumRawScore;
    rawScore += 1
  ) {
    const ratio =
      rawScore / maximumRawScore;

    /*
     * Development estimator only.
     *
     * Maps section performance into the
     * official 200–800 section scale,
     * then deliberately exposes a range
     * instead of pretending to know an
     * exact adaptive score.
     */
    const center =
      200 + ratio * 600;

    let min =
      roundToTen(center - 40);

    let max =
      roundToTen(center + 40);

    min = clamp(
      min,
      200,
      800,
    );

    max = clamp(
      max,
      200,
      800,
    );

    if (rawScore === 0) {
      min = 200;
      max = 240;
    }

    if (
      rawScore ===
      maximumRawScore
    ) {
      min = 760;
      max = 800;
    }

    rows.push({
      rawScore,

      score: {
        min,
        max,
      },
    });
  }

  return rows;
}

export const DIGITAL_SAT_ESTIMATION_DATASET:
  ExamRangeDataset = {
  metadata: {
    id:
      "digital-sat-general-estimator",

    version: "1.0.0",

    examId: "digital-sat",

    name:
      "Digital SAT General Estimation Dataset",

    sourceType:
      "estimated",

    sourceName:
      "Internal transparent estimation model",

    methodology:
      "Deterministic score-range estimator based on section-level correct-answer totals. It does not reproduce official adaptive SAT scoring.",

    effectiveFrom:
      "2026-10-07",

    verified: false,
  },

  sections: [
    {
      sectionId:
        "reading-writing",

      maximumRawScore: 54,

      rows:
        createEstimatedRows(54),
    },

    {
      sectionId: "math",

      maximumRawScore: 44,

      rows:
        createEstimatedRows(44),
    },
  ],
};