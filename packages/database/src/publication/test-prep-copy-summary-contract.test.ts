import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");
const component = readFileSync(new URL("../../../../apps/web/src/components/shared/copy-result-summary.tsx", import.meta.url), "utf8");

describe("saved result summary copy interaction", () => {
  it("copies the authorized saved summary instead of recalculating or fetching records", () => {
    expect(page).toContain("<CopyResultSummary summary={result.summary} details={{");
    expect(component).toContain("navigator.clipboard.writeText(summary)");
    expect(component).not.toContain("dangerouslySetInnerHTML");
  });
  it("provides accessible feedback and handles unsupported clipboard APIs", () => {
    expect(component).toContain('aria-label="Copy saved result summary"');
    expect(component).toContain('role="status"');
    expect(component).toContain("Clipboard unavailable");
    expect(component).toContain("clearTimeout(resetTimer.current)");
  });
});
