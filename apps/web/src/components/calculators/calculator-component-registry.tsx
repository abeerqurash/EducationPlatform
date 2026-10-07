import type {
  CalculatorKey,
} from "@education/calculators";

import {
  GPACalculator,
} from "./gpa-calculator";

import {
  GradeCalculator,
} from "./grade-calculator";

import {
  FinalGradeCalculator,
} from "./final-grade-calculator";

import {
  PercentageCalculator,
} from "./percentage-calculator";

import {
  AverageCalculator,
} from "./average-calculator";

import {
  PercentageChangeCalculator,
} from "./percentage-change-calculator";

import {
  WeightedAverageCalculator,
} from "./weighted-average-calculator";

import {
  DigitalSatCalculator,
} from "./digital-sat-calculator";

type CalculatorRendererProps = {
  calculatorKey: CalculatorKey;
};

export function CalculatorRenderer({
  calculatorKey,
}: CalculatorRendererProps) {
  switch (calculatorKey) {
    case "gpa":
      return <GPACalculator />;

    case "grade":
      return <GradeCalculator />;

    case "finalGrade":
      return <FinalGradeCalculator />;

    case "percentage":
      return <PercentageCalculator />;

    case "average":
      return <AverageCalculator />;

    case "percentageChange":
      return (
        <PercentageChangeCalculator />
      );

    case "weightedAverage":
      return (
        <WeightedAverageCalculator />
      );

    case "digitalSat":
      return <DigitalSatCalculator />;
  }
}