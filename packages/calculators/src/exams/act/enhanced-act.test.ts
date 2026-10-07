import {
  describe,
  expect,
  it,
} from "vitest";

import {
  ENHANCED_ACT_DEFINITION,
} from "./enhanced-act-definition";

import {
  calculateEnhancedActComposite,
  calculateEnhancedActSuperscore,
  safeCalculateEnhancedActComposite,
} from "./enhanced-act";

describe(
  "Enhanced ACT",
  () => {
    it(
      "stores the current enhanced test structure",
      () => {
        expect(
          ENHANCED_ACT_DEFINITION
            .sections
            .map(
              (section) => [
                section.key,
                section.questions,
                section.minutes,
              ],
            ),
        ).toEqual([
          [
            "english",
            50,
            35,
          ],
          [
            "math",
            45,
            50,
          ],
          [
            "reading",
            36,
            40,
          ],
          [
            "science",
            40,
            40,
          ],
        ]);
      },
    );

    it(
      "calculates Composite from English Math and Reading only",
      () => {
        const result =
          calculateEnhancedActComposite({
            english: 30,
            math: 27,
            reading: 33,
            science: 12,
          });

        expect(
          result.composite,
        ).toBe(30);

        expect(
          result
            .scienceIncludedInComposite,
        ).toBe(false);
      },
    );

    it(
      "rounds Composite according to ACT whole-number rules",
      () => {
        expect(
          calculateEnhancedActComposite({
            english: 30,
            math: 30,
            reading: 29,
          }).composite,
        ).toBe(30);

        expect(
          calculateEnhancedActComposite({
            english: 30,
            math: 29,
            reading: 29,
          }).composite,
        ).toBe(29);
      },
    );

    it(
      "supports a Composite without optional science",
      () => {
        const result =
          calculateEnhancedActComposite({
            english: 36,
            math: 36,
            reading: 36,
          });

        expect(
          result.composite,
        ).toBe(36);

        expect(
          result.science,
        ).toBeNull();

        expect(
          result.stem,
        ).toBeNull();
      },
    );

    it(
      "calculates STEM when science is supplied",
      () => {
        const result =
          calculateEnhancedActComposite({
            english: 25,
            math: 31,
            reading: 28,
            science: 32,
          });

        expect(
          result.stem,
        ).toBe(32);
      },
    );

    it(
      "rejects scores outside 1 through 36",
      () => {
        expect(
          safeCalculateEnhancedActComposite({
            english: 0,
            math: 20,
            reading: 20,
          }).success,
        ).toBe(false);

        expect(
          safeCalculateEnhancedActComposite({
            english: 20,
            math: 37,
            reading: 20,
          }).success,
        ).toBe(false);
      },
    );

    it(
      "rejects fractional and non-finite section scores",
      () => {
        expect(
          safeCalculateEnhancedActComposite({
            english: 20.5,
            math: 20,
            reading: 20,
          }).success,
        ).toBe(false);

        expect(
          safeCalculateEnhancedActComposite({
            english: 20,
            math: Number.NaN,
            reading: 20,
          }).success,
        ).toBe(false);
      },
    );

    it(
      "calculates an enhanced ACT superscore from best section scores",
      () => {
        const result =
          calculateEnhancedActSuperscore([
            {
              english: 30,
              math: 25,
              reading: 28,
              science: 31,
            },
            {
              english: 27,
              math: 32,
              reading: 26,
              science: 29,
            },
            {
              english: 29,
              math: 30,
              reading: 34,
            },
          ]);

        expect(
          result.english,
        ).toBe(30);

        expect(
          result.math,
        ).toBe(32);

        expect(
          result.reading,
        ).toBe(34);

        expect(
          result.science,
        ).toBe(31);

        expect(
          result.composite,
        ).toBe(32);
      },
    );

    it(
      "rejects an empty superscore attempt list",
      () => {
        expect(
          () =>
            calculateEnhancedActSuperscore(
              [],
            ),
        ).toThrow(
          "Add at least one ACT attempt.",
        );
      },
    );
  },
);
