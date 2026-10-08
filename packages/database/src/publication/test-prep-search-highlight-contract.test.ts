import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");
const highlight = readFileSync(new URL("../../../../apps/web/src/components/shared/highlight-search-match.tsx", import.meta.url), "utf8");

describe("test prep saved result search highlighting", () => {
  it("highlights both calculator names and summaries with the normalized search", () => {
    expect(page).toContain('<HighlightSearchMatch text={result.toolName} query={history.q} />');
    expect(page).toContain('<HighlightSearchMatch text={result.summary} query={history.q} />');
  });
  it("uses escaped literal matches and safe React markup, not raw HTML", () => {
    expect(highlight).toContain('needle.replace(');
    expect(highlight).toContain('new RegExp(escaped, "gi")');
    expect(highlight).toContain('<mark key=');
    expect(highlight).not.toContain('dangerouslySetInnerHTML');
    expect(highlight).not.toContain('innerHTML');
  });
  it("keeps unfiltered results unchanged", () => {
    expect(highlight).toContain('if (!needle || !text) return <>{text}</>');
  });
});
