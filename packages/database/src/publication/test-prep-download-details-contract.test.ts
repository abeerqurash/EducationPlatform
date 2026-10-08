import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const component = readFileSync(new URL("../../../../apps/web/src/components/shared/copy-result-summary.tsx", import.meta.url), "utf8");
const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");

describe("saved result browser text download", () => {
  it("uses only authorized, already-displayed result fields", () => {
    expect(page).toContain("<CopyResultSummary summary={result.summary}");
    expect(component).toContain("formatSavedResultDetails({ ...details, summary })");
  });
  it("generates a plain-text download in the browser without a server endpoint", () => {
    expect(component).toContain('type: "text/plain;charset=utf-8"');
    expect(component).toContain('anchor.download = savedResultFilename(');
    expect(component).toContain("URL.revokeObjectURL(url)");
    expect(component).not.toContain("dangerouslySetInnerHTML");
  });
  it("has safe filenames, keyboard-accessible buttons, and status feedback", () => {
    expect(component).toContain('replace(/[^a-z0-9]+/g, "-")');
    expect(component).toContain('aria-label="Download saved result details as text"');
    expect(component).toContain('role="status"');
    expect(component).toContain('status === "download"');
  });
});
