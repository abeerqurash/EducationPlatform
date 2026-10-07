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
    expect(source).toContain(
      "Number.isSafeInteger(parsed)",
    );
    expect(source).toContain(
      ".slice(0, MAX_ADMIN_SEARCH_LENGTH)",
    );
    expect(source).toContain(
      "normalizedSort",
    );
    expect(source).toContain(
      "q: normalizedSearch || undefined",
    );
    expect(source).toContain(
      "const normalizedSearch",
    );
    expect(source).toContain(
      "defaultValue={normalizedSearch}",
    );
    expect(source).toContain(
      "maxLength={MAX_ADMIN_SEARCH_LENGTH}",
    );
    expect(source).toContain(
      "pageStart + visibleTools.length",
    );
    expect(source).toContain(
      'aria-label="Search publication tools"',
    );
    expect(source).toContain(
      'aria-live="polite"',
    );
    expect(source).toContain(
      'aria-atomic="true"',
    );
    expect(source).toContain(
      'id="publication-search"',
    );
    expect(source).toContain(
      'htmlFor="publication-search"',
    );
    expect(source).toContain(
      "Search publication tools",
    );
    expect(source).toContain(
      'href="/admin/publication"',
    );
    expect(source).toContain(
      "MAX_ADMIN_SEARCH_LENGTH",
    );
    expect(source).toContain(
      "MAX_ADMIN_PAGE",
    );
    expect(source).toContain(
      "parsed <= MAX_ADMIN_PAGE",
    );
    expect(source).toContain(
      "const currentPage",
    );
    expect(source).toContain(
      "requestedPage",
    );
  });

  it("keeps filtering read only", () => {
    expect(source).not.toContain(
      "runPublicationAction({",
    );
  });
});
