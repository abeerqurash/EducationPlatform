import {
  describe,
  expect,
  it,
} from "vitest";

import {
  readFileSync,
} from "node:fs";

const source =
  readFileSync(
    new URL(
      "./admin-detail-repository.ts",
      import.meta.url,
    ),
    "utf8",
  );

describe(
  "admin publication detail input boundary",
  () => {
    it(
      "rejects malformed tool IDs before repository queries",
      () => {
        const validationIndex =
          source.indexOf(
            "z.string().uuid().safeParse(toolId)",
          );

        const firstQueryIndex =
          source.indexOf(
            "await db",
          );

        expect(validationIndex).toBeGreaterThan(
          -1,
        );
        expect(firstQueryIndex).toBeGreaterThan(
          validationIndex,
        );
      },
    );

    it(
      "returns no detail for invalid identifiers",
      () => {
        expect(source).toMatch(
          /if\s*\(\s*!z\.string\(\)\.uuid\(\)\.safeParse\(toolId\)\.success\s*\)\s*{\s*return null;/s,
        );
      },
    );
  },
);
