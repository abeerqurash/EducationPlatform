export interface ExamDatasetVersion {
  id: string;
  exam: string;
  year: number;
  version: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
}