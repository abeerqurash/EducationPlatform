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
      "../../../../apps/web/src/app/admin/publication/publication-actions.tsx",
      import.meta.url,
    ),
    "utf8",
  );

describe(
  "admin publication action semantics",
  () => {
    it(
      "associates the action reason with a stable control",
      () => {
        expect(source).toContain(
          'htmlFor={`publication-reason-${toolId}`}',
        );
        expect(source).toContain(
          'id={`publication-reason-${toolId}`}',
        );
      },
    );

    it(
      "keeps the server-aligned reason length boundary visible in the UI",
      () => {
        expect(source).toContain(
          "maxLength={1000}",
        );
      },
    );

    it(
      "preserves non-interruptive action feedback semantics when rendered",
      () => {
        expect(source).toContain(
          '? "assertive"',
        );
        expect(source).toContain(
          ': "polite"',
        );
        expect(source).toContain(
          'aria-atomic="true"',
        );
        expect(source).toContain(
          '? "alert"',
        );
        expect(source).toContain(
          ': "status"',
        );
      },
    );
  },
);
