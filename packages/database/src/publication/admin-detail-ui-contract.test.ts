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
      "../../../../apps/web/src/app/admin/publication/[toolId]/page.tsx",
      import.meta.url,
    ),
    "utf8",
  );

describe(
  "admin publication detail semantics",
  () => {
    it(
      "names the major editorial regions",
      () => {
        expect(source).toContain(
          'aria-label="Publication status summary"',
        );
        expect(source).toContain(
          'aria-labelledby="publication-readiness-heading"',
        );
        expect(source).toContain(
          'aria-labelledby="latest-review-heading"',
        );
        expect(source).toContain(
          'aria-labelledby="linked-sources-heading"',
        );
      },
    );

    it(
      "connects region labels to unique headings",
      () => {
        expect(source).toContain(
          'id="publication-readiness-heading"',
        );
        expect(source).toContain(
          'id="latest-review-heading"',
        );
        expect(source).toContain(
          'id="linked-sources-heading"',
        );
      },
    );

    it(
      "exposes readiness as non-interruptive status feedback",
      () => {
        expect(source).toContain(
          'role="status"',
        );
        expect(source).toContain(
          'aria-live="polite"',
        );
        expect(source).toContain(
          'aria-atomic="true"',
        );
      },
    );
  },
);
