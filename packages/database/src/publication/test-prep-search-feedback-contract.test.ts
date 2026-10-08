import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../../../../apps/web/src/app/dashboard/test-prep/page.tsx", import.meta.url), "utf8");

describe("saved exam result search feedback", () => {
  it("announces the result range and selected keyword without injecting HTML", () => {
    expect(page).toContain('role="status" aria-live="polite"');
    expect(page).toContain('history.q ? <> for <span');
    expect(page).toContain('“{history.q}”');
    expect(page).not.toContain("dangerouslySetInnerHTML");
  });
  it("distinguishes an empty search, an empty filtered result, and a new account", () => {
    expect(page).toContain('No saved exam results match <strong>');
    expect(page).toContain('No saved exam results match the selected filters.');
    expect(page).toContain('No saved SAT or ACT results yet.');
  });
  it("keeps adjacent page-jump input and button at the shared 50px height", () => {
    expect(page).toContain('className="h-[50px] w-28 rounded-xl');
    expect(page).toContain('className="inline-flex h-[50px] items-center justify-center rounded-full bg-[#171912]');
  });
});
