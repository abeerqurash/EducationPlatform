import type {
  ExamScoreRange,
  ScoringDatasetMetadata,
} from "./types";

export type RawScoreRangeRow = {
  rawScore: number;

  score: ExamScoreRange;
};

export type SectionRangeDataset = {
  sectionId: string;

  maximumRawScore: number;

  rows: readonly RawScoreRangeRow[];
};

export type ExamRangeDataset = {
  metadata: ScoringDatasetMetadata;

  sections: readonly SectionRangeDataset[];
};