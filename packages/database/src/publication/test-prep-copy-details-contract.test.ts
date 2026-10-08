import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");
const component = readFileSync(new URL("../../../../apps/web/src/components/shared/copy-result-summary.tsx", import.meta.url), "utf8");

describe("saved result details clipboard contract", () => {
  it("passes only authorized fields already visible to the signed-in user", () => {
    expect(page).toContain("toolName: result.toolName");
    expect(page).toContain("savedDateUtc: result.createdAt.toISOString().slice(0, 10)");
    expect(page).toContain("calculatorVersion: result.calculatorVersion");
  });
  it("includes a UTC date and optional version without mutating stored results", () => {
    expect(component).toContain("formatSavedResultDetails");
    expect(component).toContain('`Saved: ${input.savedDateUtc} UTC`');
    expect(component).toContain('`Calculator version: ${input.calculatorVersion}`');
    expect(component).not.toContain("dangerouslySetInnerHTML");
  });
  it("offers accessible copy actions and clipboard failure feedback", () => {
    expect(component).toContain('aria-label="Copy saved result details"');
    expect(component).toContain('aria-label="Copy saved result summary"');
    expect(component).toContain('role="status"');
    expect(component).toContain("Clipboard unavailable");
  });
});
