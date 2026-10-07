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
      "../../../../apps/web/src/app/admin/publication/page.tsx",
      import.meta.url,
    ),
  ),
  "utf8",
);

describe("admin publication list UI", () => {
  it("supports server-rendered search and editorial filters", () => {
    expect(source).toContain(
      "searchParams",
    );
    expect(source).toContain(
      'name="q"',
    );
    expect(source).toContain(
      'name="status"',
    );
    expect(source).toContain(
      'name="verification"',
    );
    expect(source).toContain(
      "visibleTools",
    );
    expect(source).toContain(
      'name="sort"',
    );
    expect(source).toContain(
      "PAGE_SIZE",
    );
    expect(source).toContain(
      "buildPublicationHref",
    );
    expect(source).toContain(
      "currentPage",
    );
    expect(source).toContain(
      "totalPages",
    );
  });

  it("keeps filtering read only", () => {
    expect(source).not.toContain(
      "runPublicationAction({",
    );
  });
});
