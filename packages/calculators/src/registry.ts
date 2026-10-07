export type CalculatorStatus =
  | "active"
  | "deprecated";

export type CalculatorDefinition = {
  id: string;
  slug: string;
  category: string;

  engineKey: string;

  version: string;
  formulaVersion: string;

  status: CalculatorStatus;

  effectiveFrom: string;

  scale?: {
    minimum: number;
    maximum: number;
    label: string;
  };
};

export const calculatorRegistry = {
  gpa: {
    id: "gpa-calculator",
    slug: "gpa-calculator",
    category: "gpa",

    engineKey: "gpa",

    version: "1.0.0",
    formulaVersion: "1.0.0",

    status: "active",

    effectiveFrom:
      "2026-10-07",

    scale: {
      minimum: 0,
      maximum: 4,
      label: "4.0 scale",
    },
  },

  grade: {
    id: "grade-calculator",
    slug: "grade-calculator",
    category: "grades",

    engineKey: "grade",

    version: "1.0.0",
    formulaVersion: "1.0.0",

    status: "active",

    effectiveFrom:
      "2026-10-07",

    scale: {
      minimum: 0,
      maximum: 100,
      label: "Percentage",
    },
  },

  finalGrade: {
    id:
      "final-grade-calculator",
    slug:
      "final-grade-calculator",
    category: "grades",

    engineKey: "final-grade",

    version: "1.0.0",
    formulaVersion: "1.0.0",

    status: "active",

    effectiveFrom:
      "2026-10-07",

    scale: {
      minimum: 0,
      maximum: 100,
      label: "Percentage",
    },
  },

  percentage: {
    id:
      "percentage-calculator",
    slug:
      "percentage-calculator",
    category: "math",

    engineKey: "percentage",

    version: "1.0.0",
    formulaVersion: "1.0.0",

    status: "active",

    effectiveFrom:
      "2026-10-07",
  },

  average: {
    id:
      "average-calculator",
    slug:
      "average-calculator",
    category: "math",

    engineKey: "average",

    version: "1.0.0",
    formulaVersion: "1.0.0",

    status: "active",

    effectiveFrom:
      "2026-10-07",
  },

  percentageChange: {
    id:
      "percentage-change-calculator",

    slug:
      "percentage-change-calculator",

    category: "math",

    engineKey:
      "percentage-change",

    version: "1.0.0",

    formulaVersion:
      "1.0.0",

    status: "active",

    effectiveFrom:
      "2026-10-07",
  },

  weightedAverage: {
    id:
      "weighted-average-calculator",

    slug:
      "weighted-average-calculator",

    category: "math",

    engineKey:
      "weighted-average",

    version: "1.0.0",

    formulaVersion:
      "1.0.0",

    status: "active",

    effectiveFrom:
      "2026-10-07",
  },

  digitalSat: {
    id:
      "digital-sat-score-calculator",
    slug:
      "digital-sat-score-calculator",
    category:
      "test-prep",
    engineKey:
      "digital-sat",
    version:
      "1.0.0",
    formulaVersion:
      "1.0.0",
    status:
      "active",
    effectiveFrom:
      "2026-10-07",
  },

  enhancedAct: {
    id:
      "act-score-calculator",
    slug:
      "act-score-calculator",
    category:
      "test-prep",
    engineKey:
      "enhanced-act",
    version:
      "1.0.0",
    formulaVersion:
      "1.0.0",
    status:
      "active",
    effectiveFrom:
      "2025-09-01",
    scale: {
      minimum: 1,
      maximum: 36,
      label:
        "ACT section and Composite scale",
    },
  },
} satisfies Record<
  string,
  CalculatorDefinition
>;

export type CalculatorKey =
  keyof typeof calculatorRegistry;

export function getCalculatorDefinition(
  key: CalculatorKey,
) {
  return calculatorRegistry[key];
}
