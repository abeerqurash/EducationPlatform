import type {
  CalculatorConfiguration,
} from "../schema/tools";

export type CalculatorPublicationRequirements = {
  requireFormula: boolean;
  requireVerifiedSource: boolean;
};

export function resolveCalculatorPublicationRequirements(
  configuration: CalculatorConfiguration | null | undefined,
): CalculatorPublicationRequirements {
  const flags = configuration?.featureFlags;

  const datasetDriven =
    flags?.datasetDriven === true ||
    (
      flags?.rangeOutput === true &&
      flags?.officialScoreClaim === false
    );

  return {
    requireFormula: !datasetDriven,
    requireVerifiedSource: true,
  };
}
