export type ExamSectionDefinition = {
  id: string;
  name: string;
  shortName: string;

  scoreMin: number;
  scoreMax: number;

  modules: readonly ExamModuleDefinition[];
};

export type ExamModuleDefinition = {
  id: string;
  name: string;
  questionCount: number;
};

export type ExamDefinition = {
  id: string;
  name: string;
  version: string;

  totalScoreMin: number;
  totalScoreMax: number;

  sections: readonly ExamSectionDefinition[];
};

export type ExamScoreRange = {
  min: number;
  max: number;
};

export type ScoringDatasetMetadata = {
  id: string;
  version: string;

  examId: string;

  name: string;

  sourceType:
    | "official"
    | "derived"
    | "estimated";

  sourceName: string;

  methodology: string;

  effectiveFrom?: string;

  verified: boolean;
};