import { describe, expect, it } from "vitest";
import {
  resolveCalculatorPublicationRequirements,
} from "./calculator-requirements";

describe("calculator publication requirements", () => {
  it("is strict for formula calculators by default", () => {
    expect(resolveCalculatorPublicationRequirements(null)).toEqual({
      requireFormula: true,
      requireVerifiedSource: true,
    });
  });

  it("allows an explicitly dataset-driven calculator to omit a formula", () => {
    expect(
      resolveCalculatorPublicationRequirements({
        featureFlags: { datasetDriven: true },
      }),
    ).toEqual({
      requireFormula: false,
      requireVerifiedSource: true,
    });
  });

  it("recognizes the existing SAT range-estimator feature policy", () => {
    expect(
      resolveCalculatorPublicationRequirements({
        featureFlags: {
          rangeOutput: true,
          officialScoreClaim: false,
        },
      }).requireFormula,
    ).toBe(false);
  });
});
