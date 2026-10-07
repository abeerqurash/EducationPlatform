import {
  describe,
  expect,
  it,
} from "vitest";
import {
  readFileSync,
} from "node:fs";

const read = (path: string) =>
  readFileSync(
    new URL(path, import.meta.url),
    "utf8",
  );

const registry = read(
  "../../../../apps/web/src/components/calculators/calculator-component-registry.tsx",
);
const bridge = read(
  "../../../../apps/web/src/components/calculators/calculator-save-bridge.tsx",
);
const toolPage = read(
  "../../../../apps/web/src/app/tools/[category]/[slug]/page.tsx",
);
const dashboard = read(
  "../../../../apps/web/src/app/dashboard/page.tsx",
);

describe("calculator save workflow", () => {
  it("wraps every registry calculator with the shared save bridge", () => {
    for (const key of [
      "gpa",
      "grade",
      "finalGrade",
      "percentage",
      "average",
      "percentageChange",
      "weightedAverage",
      "digitalSat",
    ]) {
      expect(registry).toContain(
        `case "${key}"`,
      );
    }

    expect(registry).toContain(
      "<CalculatorSaveBridge",
    );
  });

  it("uses the server-owned tool presentation identity", () => {
    expect(toolPage).toContain(
      "toolSlug={tool.slug}",
    );
    expect(toolPage).toContain(
      "toolName={tool.name}",
    );
  });

  it("only exposes saving after a non-empty calculated result", () => {
    expect(bridge).toContain(
      ".calculator-result__empty",
    );
    expect(bridge).toContain(
      "<SaveResultButton",
    );
    expect(bridge).toContain(
      "MutationObserver",
    );
    expect(bridge).toContain(
      "root: HTMLElement,\n  toolName: string",
    );
    expect(bridge).toContain(
      "captureCalculator(\n        rootRef.current,\n        toolName",
    );
  });

  it("connects real saved activity to dashboard metrics and recent results", () => {
    expect(dashboard).toContain(
      "getStudentResultOverview",
    );
    expect(dashboard).toContain(
      "resultOverview.toolsUsed",
    );
    expect(dashboard).toContain(
      "resultOverview.recentResults",
    );
  });
});
