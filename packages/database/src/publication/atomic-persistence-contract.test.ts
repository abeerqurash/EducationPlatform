import {
  describe,
  expect,
  it,
} from "vitest";

import {
  readFileSync,
} from "node:fs";

import {
  fileURLToPath,
} from "node:url";

const source =
  readFileSync(
    fileURLToPath(
      new URL(
        "./atomic-persistence.ts",
        import.meta.url,
      ),
    ),
    "utf8",
  );

describe(
  "atomic publication persistence contract",
  () => {
    it(
      "resolves editorial state inside the same transaction that mutates the tool",
      () => {
        expect(source).toContain(
          "return db.transaction(",
        );

        expect(source).toContain(
          "calculatorVersions",
        );

        expect(source).toContain(
          "formulaVersions",
        );

        expect(source).toContain(
          "calculatorVersionSources",
        );

        expect(source).toContain(
          "reviews",
        );
      },
    );

    it(
      "uses expected status in the mutation predicate",
      () => {
        expect(source).toMatch(
          /eq\(\s*tools\.status,\s*plan\.fromStatus,\s*\)/,
        );
      },
    );

    it(
      "keeps publication requirements strict and server owned",
      () => {
      expect(source).not.toMatch(
        /input\.requireFormula/,
      );
      expect(source).not.toMatch(
        /input\.requireVerifiedSource/,
      );
      expect(source).toMatch(
        /requireFormula:\s*true/,
      );
      expect(source).toMatch(
        /requireVerifiedSource:\s*true/,
      );
        expect(source).toMatch(
          /requireFormula:\s*true/,
        );

        expect(source).toMatch(
          /requireVerifiedSource:\s*true/,
        );
      },
    );
  },
);  it("uses typed not-found and state-conflict persistence errors", () => {
    expect(source).toContain(
      "PublicationTargetNotFoundError",
    );
    expect(source).toContain(
      "PublicationStateConflictError",
    );
  

});


