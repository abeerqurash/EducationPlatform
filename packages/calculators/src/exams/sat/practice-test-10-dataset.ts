export type SatOfficialPracticeScoreRangeRow = {
  rawScore: number;
  min: number;
  max: number;
};

export type SatOfficialPracticeDataset = {
  id: string;
  version: string;
  practiceTest: number;
  scoringMode: "official-paper-practice-range";
  sourceType: "official";
  publisher: "College Board";
  sourceTitle: string;
  sourceUrl: string;
  applicableYear: number;
  readingWritingMaximumRawScore: number;
  mathMaximumRawScore: number;
  readingWriting: readonly SatOfficialPracticeScoreRangeRow[];
  math: readonly SatOfficialPracticeScoreRangeRow[];
};

const readingWriting:
  readonly SatOfficialPracticeScoreRangeRow[] = [
  { rawScore: 0, min: 200, max: 200 },
  { rawScore: 1, min: 210, max: 220 },
  { rawScore: 2, min: 210, max: 220 },
  { rawScore: 3, min: 210, max: 220 },
  { rawScore: 4, min: 210, max: 220 },
  { rawScore: 5, min: 210, max: 230 },
  { rawScore: 6, min: 220, max: 240 },
  { rawScore: 7, min: 220, max: 250 },
  { rawScore: 8, min: 230, max: 260 },
  { rawScore: 9, min: 230, max: 270 },
  { rawScore: 10, min: 240, max: 280 },
  { rawScore: 11, min: 240, max: 290 },
  { rawScore: 12, min: 250, max: 300 },
  { rawScore: 13, min: 250, max: 310 },
  { rawScore: 14, min: 260, max: 320 },
  { rawScore: 15, min: 270, max: 330 },
  { rawScore: 16, min: 280, max: 340 },
  { rawScore: 17, min: 300, max: 340 },
  { rawScore: 18, min: 310, max: 350 },
  { rawScore: 19, min: 320, max: 360 },
  { rawScore: 20, min: 330, max: 370 },
  { rawScore: 21, min: 330, max: 370 },
  { rawScore: 22, min: 340, max: 380 },
  { rawScore: 23, min: 350, max: 390 },
  { rawScore: 24, min: 350, max: 390 },
  { rawScore: 25, min: 360, max: 400 },
  { rawScore: 26, min: 370, max: 410 },
  { rawScore: 27, min: 370, max: 410 },
  { rawScore: 28, min: 380, max: 420 },
  { rawScore: 29, min: 390, max: 430 },
  { rawScore: 30, min: 400, max: 440 },
  { rawScore: 31, min: 400, max: 440 },
  { rawScore: 32, min: 410, max: 450 },
  { rawScore: 33, min: 420, max: 460 },
  { rawScore: 34, min: 430, max: 470 },
  { rawScore: 35, min: 440, max: 480 },
  { rawScore: 36, min: 450, max: 490 },
  { rawScore: 37, min: 460, max: 500 },
  { rawScore: 38, min: 460, max: 500 },
  { rawScore: 39, min: 470, max: 510 },
  { rawScore: 40, min: 470, max: 530 },
  { rawScore: 41, min: 480, max: 540 },
  { rawScore: 42, min: 490, max: 550 },
  { rawScore: 43, min: 500, max: 560 },
  { rawScore: 44, min: 510, max: 570 },
  { rawScore: 45, min: 520, max: 580 },
  { rawScore: 46, min: 530, max: 590 },
  { rawScore: 47, min: 540, max: 600 },
  { rawScore: 48, min: 550, max: 610 },
  { rawScore: 49, min: 570, max: 630 },
  { rawScore: 50, min: 580, max: 640 },
  { rawScore: 51, min: 590, max: 650 },
  { rawScore: 52, min: 600, max: 660 },
  { rawScore: 53, min: 610, max: 670 },
  { rawScore: 54, min: 620, max: 680 },
  { rawScore: 55, min: 630, max: 690 },
  { rawScore: 56, min: 640, max: 700 },
  { rawScore: 57, min: 670, max: 710 },
  { rawScore: 58, min: 680, max: 720 },
  { rawScore: 59, min: 690, max: 730 },
  { rawScore: 60, min: 700, max: 740 },
  { rawScore: 61, min: 720, max: 760 },
  { rawScore: 62, min: 730, max: 770 },
  { rawScore: 63, min: 740, max: 780 },
  { rawScore: 64, min: 760, max: 780 },
  { rawScore: 65, min: 770, max: 800 },
  { rawScore: 66, min: 800, max: 800 },
];

const math:
  readonly SatOfficialPracticeScoreRangeRow[] = [
  { rawScore: 0, min: 200, max: 200 },
  { rawScore: 1, min: 210, max: 220 },
  { rawScore: 2, min: 210, max: 220 },
  { rawScore: 3, min: 210, max: 220 },
  { rawScore: 4, min: 210, max: 230 },
  { rawScore: 5, min: 210, max: 240 },
  { rawScore: 6, min: 220, max: 250 },
  { rawScore: 7, min: 230, max: 260 },
  { rawScore: 8, min: 240, max: 300 },
  { rawScore: 9, min: 250, max: 310 },
  { rawScore: 10, min: 260, max: 320 },
  { rawScore: 11, min: 280, max: 340 },
  { rawScore: 12, min: 310, max: 350 },
  { rawScore: 13, min: 320, max: 360 },
  { rawScore: 14, min: 330, max: 370 },
  { rawScore: 15, min: 340, max: 380 },
  { rawScore: 16, min: 350, max: 390 },
  { rawScore: 17, min: 360, max: 400 },
  { rawScore: 18, min: 370, max: 410 },
  { rawScore: 19, min: 380, max: 420 },
  { rawScore: 20, min: 380, max: 420 },
  { rawScore: 21, min: 390, max: 430 },
  { rawScore: 22, min: 390, max: 430 },
  { rawScore: 23, min: 400, max: 440 },
  { rawScore: 24, min: 410, max: 450 },
  { rawScore: 25, min: 420, max: 460 },
  { rawScore: 26, min: 430, max: 470 },
  { rawScore: 27, min: 440, max: 480 },
  { rawScore: 28, min: 450, max: 490 },
  { rawScore: 29, min: 460, max: 500 },
  { rawScore: 30, min: 470, max: 510 },
  { rawScore: 31, min: 480, max: 520 },
  { rawScore: 32, min: 490, max: 530 },
  { rawScore: 33, min: 490, max: 550 },
  { rawScore: 34, min: 510, max: 570 },
  { rawScore: 35, min: 520, max: 580 },
  { rawScore: 36, min: 530, max: 590 },
  { rawScore: 37, min: 540, max: 600 },
  { rawScore: 38, min: 550, max: 610 },
  { rawScore: 39, min: 560, max: 620 },
  { rawScore: 40, min: 580, max: 640 },
  { rawScore: 41, min: 590, max: 650 },
  { rawScore: 42, min: 600, max: 660 },
  { rawScore: 43, min: 610, max: 670 },
  { rawScore: 44, min: 620, max: 680 },
  { rawScore: 45, min: 640, max: 700 },
  { rawScore: 46, min: 650, max: 710 },
  { rawScore: 47, min: 670, max: 730 },
  { rawScore: 48, min: 680, max: 740 },
  { rawScore: 49, min: 700, max: 760 },
  { rawScore: 50, min: 730, max: 770 },
  { rawScore: 51, min: 750, max: 780 },
  { rawScore: 52, min: 770, max: 790 },
  { rawScore: 53, min: 780, max: 800 },
  { rawScore: 54, min: 800, max: 800 },
];

/**
 * Official raw-score conversion ranges published by College Board
 * for the PAPER version of SAT Practice Test #10.
 *
 * This dataset MUST NOT be used to claim an official score for a
 * live adaptive SAT administration. College Board describes the
 * paper-practice conversion as a simplified approximation of the
 * scoring used on the actual adaptive test.
 */
export const SAT_PRACTICE_TEST_10_DATASET:
  SatOfficialPracticeDataset = {
    id:
      "college-board-sat-paper-practice-test-10",
    version:
      "2025.1",
    practiceTest:
      10,
    scoringMode:
      "official-paper-practice-range",
    sourceType:
      "official",
    publisher:
      "College Board",
    sourceTitle:
      "Scoring Your Paper SAT Practice Test #10",
    sourceUrl:
      "https://satsuite.collegeboard.org/media/pdf/scoring-sat-practice-test-10-digital.pdf",
    applicableYear:
      2025,
    readingWritingMaximumRawScore:
      66,
    mathMaximumRawScore:
      54,
    readingWriting,
    math,
  };
