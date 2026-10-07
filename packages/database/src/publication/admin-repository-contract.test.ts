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

const source = readFileSync(
  fileURLToPath(
    new URL(
      "./admin-repository.ts",
      import.meta.url,
    ),
  ),
  "utf8",
);

describe(
  "admin publication repository contract",
  () => {
    it(
      "reads publication state without mutating it",
      () => {
        expect(source).toContain(
          ".from(tools)",
        );
        expect(source).toContain(
          "calculatorVersions",
        );
        expect(source).not.toMatch(
          /\.update\s*\(/,
        );
        expect(source).not.toMatch(
          /\.insert\s*\(/,
        );
        expect(source).not.toMatch(
          /\.delete\s*\(/,
        );
      },
    );

    it(
      "joins only the active calculator matching the tool current version",
      () => {
        expect(source).toContain(
          "calculatorVersions.toolId",
        );
        expect(source).toContain(
          "calculatorVersions.version",
        );
        expect(source).toContain(
          "tools.currentVersion",
        );
        expect(source).toContain(
          "calculatorVersions.isActive",
        );
        expect(source).toMatch(
          /calculatorVersions\.isActive,\s*true/,
        );
      },
    );

    it(
      "does not deduplicate ambiguous calculator-version rows in application code",
      () => {
        expect(source).not.toContain(
          "new Set<string>()",
        );
        expect(source).not.toContain(
          "rows.filter",
        );
      },
    );
  },
);
