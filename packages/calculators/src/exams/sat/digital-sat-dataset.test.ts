import {
  describe,
  expect,
  it,
} from "vitest";

import {
  DIGITAL_SAT_ESTIMATION_DATASET,
} from "./digital-sat-estimation-dataset";

describe(
  "Digital SAT estimation dataset",
  () => {
    it(
      "contains both required sections",
      () => {
        expect(
          DIGITAL_SAT_ESTIMATION_DATASET
            .sections
            .map(
              (section) =>
                section.sectionId,
            ),
        ).toEqual([
          "reading-writing",
          "math",
        ]);
      },
    );

    it(
      "contains every Reading and Writing raw score",
      () => {
        const section =
          DIGITAL_SAT_ESTIMATION_DATASET
            .sections[0];

        expect(
          section.rows,
        ).toHaveLength(55);

        expect(
          section.rows[0]
            .rawScore,
        ).toBe(0);

        expect(
          section.rows[54]
            .rawScore,
        ).toBe(54);
      },
    );

    it(
      "contains every Math raw score",
      () => {
        const section =
          DIGITAL_SAT_ESTIMATION_DATASET
            .sections[1];

        expect(
          section.rows,
        ).toHaveLength(45);

        expect(
          section.rows[0]
            .rawScore,
        ).toBe(0);

        expect(
          section.rows[44]
            .rawScore,
        ).toBe(44);
      },
    );

    it(
      "keeps all section ranges inside 200 to 800",
      () => {
        for (
          const section
          of DIGITAL_SAT_ESTIMATION_DATASET
            .sections
        ) {
          for (
            const row
            of section.rows
          ) {
            expect(
              row.score.min,
            ).toBeGreaterThanOrEqual(
              200,
            );

            expect(
              row.score.max,
            ).toBeLessThanOrEqual(
              800,
            );

            expect(
              row.score.min,
            ).toBeLessThanOrEqual(
              row.score.max,
            );
          }
        }
      },
    );

    it(
      "is explicitly marked as estimated and unverified",
      () => {
        expect(
          DIGITAL_SAT_ESTIMATION_DATASET
            .metadata
            .sourceType,
        ).toBe("estimated");

        expect(
          DIGITAL_SAT_ESTIMATION_DATASET
            .metadata
            .verified,
        ).toBe(false);
      },
    );
  },
);