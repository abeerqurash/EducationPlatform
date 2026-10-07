import {
  getPublicCalculator,
} from "../repositories/public-tools";

import {
  evaluateCalculatorPublication,
} from "./calculator-policy";

export async function getPublicCalculatorWithReadiness(
  categorySlug: string,
  toolSlug: string,
) {
  const calculator =
    await getPublicCalculator(
      categorySlug,
      toolSlug,
    );

  if (!calculator) {
    return null;
  }

  return {
    calculator,

    readiness:
      evaluateCalculatorPublication(
        calculator,
      ),
  };
}