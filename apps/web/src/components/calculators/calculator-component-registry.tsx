import type {
  CalculatorKey,
} from "@education/calculators";

import {
  AverageCalculator,
} from "./average-calculator";
import {
  CalculatorSaveBridge,
} from "./calculator-save-bridge";
import {
  DigitalSatCalculator,
} from "./digital-sat-calculator";
import {
  FinalGradeCalculator,
} from "./final-grade-calculator";
import {
  GPACalculator,
} from "./gpa-calculator";
import {
  GradeCalculator,
} from "./grade-calculator";
import {
  PercentageCalculator,
} from "./percentage-calculator";
import {
  PercentageChangeCalculator,
} from "./percentage-change-calculator";
import {
  WeightedAverageCalculator,
} from "./weighted-average-calculator";

type CalculatorRendererProps = {
  calculatorKey: CalculatorKey;
  toolSlug: string;
  toolName: string;
};

function calculatorFor(
  calculatorKey: CalculatorKey,
) {
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
      return <PercentageChangeCalculator />;
    case "weightedAverage":
      return <WeightedAverageCalculator />;
    case "digitalSat":
      return <DigitalSatCalculator />;
  }
}

export function CalculatorRenderer({
  calculatorKey,
  toolSlug,
  toolName,
}: CalculatorRendererProps) {
  return (
    <CalculatorSaveBridge
      toolSlug={toolSlug}
      toolName={toolName}
    >
      {calculatorFor(calculatorKey)}
    </CalculatorSaveBridge>
  );
}
