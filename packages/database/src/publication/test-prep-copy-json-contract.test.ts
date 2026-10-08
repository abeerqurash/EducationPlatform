import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const component = readFileSync(new URL("../../../../apps/web/src/components/shared/copy-result-summary.tsx", import.meta.url), "utf8");

describe("copy versioned saved-result JSON", () => {
  it("uses the same formatter as the downloadable JSON", () => {
    expect(component).toContain('formatSavedResultJson({ ...details, summary })');
    expect(component).toContain('await navigator.clipboard.writeText(formatSavedResultJson({ ...details, summary }))');
  });
  it("exposes an accessible action and clear feedback", () => {
    expect(component).toContain('aria-label="Copy saved result details as JSON"');
    expect(component).toContain('"Copy JSON"');
    expect(component).toContain('"JSON copied"');
    expect(component).toContain('role="status"');
  });
  it("preserves the other copy and download actions", () => {
    for (const label of ["Copy saved result summary", "Copy saved result details", "Download saved result details as text", "Download saved result details as JSON"]) {
      expect(component).toContain(label);
    }
  });
});
