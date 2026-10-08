import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const component = readFileSync(new URL("../../../../apps/web/src/components/shared/copy-result-summary.tsx", import.meta.url), "utf8");

describe("saved result structured JSON export", () => {
  it("exports a stable versioned schema containing only displayed fields", () => {
    expect(component).toContain("export function formatSavedResultJson(");
    for (const field of ["schemaVersion: 1", "toolName: input.toolName", "summary: input.summary", "savedDateUtc: input.savedDateUtc", "calculatorVersion: input.calculatorVersion ?? null"]) {
      expect(component).toContain(field);
    }
    expect(component).toContain("JSON.stringify(");
  });
  it("uses a browser-only JSON download with a safe filename and cleanup", () => {
    expect(component).toContain('type: "application/json;charset=utf-8"');
    expect(component).toContain(String.raw`savedResultFilename(details.toolName, details.savedDateUtc).replace(/\.txt$/, ".json")`);
    expect(component).toContain("URL.revokeObjectURL(url)");
    expect(component).not.toContain("dangerouslySetInnerHTML");
  });
  it("preserves copy and text download with accessible JSON feedback", () => {
    expect(component).toContain('aria-label="Copy saved result summary"');
    expect(component).toContain('aria-label="Download saved result details as text"');
    expect(component).toContain('aria-label="Download saved result details as JSON"');
    expect(component).toContain('status === "json"');
    expect(component).toContain('role="status"');
  });
});
