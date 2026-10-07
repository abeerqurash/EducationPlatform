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
      "./admin-repository.ts",
      import.meta.url,
    ),
    "utf8",
  );

describe(
  "admin publication repository current boundary",
  () => {
    it(
      "does not claim repository-level pagination that is not implemented",
      () => {
        expect(source).toContain(
          "listAdminPublicationTools",
        );
        expect(source).not.toContain(
          "normalizedPage",
        );
        expect(source).not.toContain(
          ".offset(",
        );
      },
    );

    it(
      "keeps the current queue ordering explicit",
      () => {
        expect(source).toContain(
          "desc(tools.updatedAt)",
        );
      },
    );
  },
);
