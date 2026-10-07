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
        "./publication-actions.tsx",
        import.meta.url,
      ),
    ),
    "utf8",
  );

describe(
  "publication Admin action UI contract",
  () => {
    it(
      "does not send identity, permissions, editorial state, or policy overrides",
      () => {
        expect(source).toContain(
          "runPublicationAction({",
        );

        expect(source).toContain(
          "toolId,",
        );

        expect(source).toContain(
          "action,",
        );

        expect(source).not.toMatch(
          /\buserId\s*:/,
        );

        expect(source).not.toMatch(
          /\bpermissionKeys\s*:/,
        );

        expect(source).not.toMatch(
          /\bresolverOptions\s*:/,
        );

        expect(source).not.toMatch(
          /\bverificationStatus\s*:/,
        );
      },
    );
  },
);
