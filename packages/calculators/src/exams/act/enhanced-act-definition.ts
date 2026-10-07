export type EnhancedActSectionDefinition = {
  key:
    | "english"
    | "math"
    | "reading"
    | "science";
  name: string;
  questions: number;
  minutes: number;
  requiredForComposite: boolean;
  optional: boolean;
  scoreMinimum: 1;
  scoreMaximum: 36;
};

export type EnhancedActDefinition = {
  id: "enhanced-act";
  version: "2026.1";
  name: "Enhanced ACT";
  compositeMinimum: 1;
  compositeMaximum: 36;
  compositeSections:
    readonly [
      "english",
      "math",
      "reading",
    ];
  scienceOptional: true;
  sections:
    readonly EnhancedActSectionDefinition[];
  sourceType: "official";
  publisher: "ACT";
  effectiveFrom: "2025-09";
};

export const ENHANCED_ACT_DEFINITION:
  EnhancedActDefinition = {
    id:
      "enhanced-act",
    version:
      "2026.1",
    name:
      "Enhanced ACT",
    compositeMinimum:
      1,
    compositeMaximum:
      36,
    compositeSections: [
      "english",
      "math",
      "reading",
    ],
    scienceOptional:
      true,
    sourceType:
      "official",
    publisher:
      "ACT",
    effectiveFrom:
      "2025-09",
    sections: [
      {
        key: "english",
        name: "English",
        questions: 50,
        minutes: 35,
        requiredForComposite: true,
        optional: false,
        scoreMinimum: 1,
        scoreMaximum: 36,
      },
      {
        key: "math",
        name: "Math",
        questions: 45,
        minutes: 50,
        requiredForComposite: true,
        optional: false,
        scoreMinimum: 1,
        scoreMaximum: 36,
      },
      {
        key: "reading",
        name: "Reading",
        questions: 36,
        minutes: 40,
        requiredForComposite: true,
        optional: false,
        scoreMinimum: 1,
        scoreMaximum: 36,
      },
      {
        key: "science",
        name: "Science",
        questions: 40,
        minutes: 40,
        requiredForComposite: false,
        optional: true,
        scoreMinimum: 1,
        scoreMaximum: 36,
      },
    ],
  };
