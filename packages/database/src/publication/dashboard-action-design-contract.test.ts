import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const web = resolve(process.cwd(), "../../apps/web/src");
const read = (path: string) => readFileSync(resolve(web, path), "utf8");

describe("dashboard visual action consistency", () => {
  it("provides shared pill styles with focus, hover and disabled treatments", () => {
    const source = read("components/shared/dashboard-action-styles.ts");
    expect(source).toContain("dashboardActionPrimary");
    expect(source).toContain("dashboardActionDanger");
    expect(source).toContain("focus-visible:outline");
    expect(source).toContain("disabled:opacity-40");
  });
  it("uses a keyboard-accessible themed checkbox for workspace selection", () => {
    const component = read("components/shared/themed-checkbox.tsx");
    const workspace = read("components/dashboard/study-goal-workspace.tsx");
    expect(component).toContain('type="checkbox"');
    expect(component).toContain("peer-checked");
    expect(workspace.match(/<ThemedCheckbox /g)?.length).toBe(3);
  });
  it("styles destructive and export actions consistently", () => {
    expect(read("components/shared/themed-confirm-dialog.tsx")).toContain("dashboardActionDanger");
    expect(read("app/dashboard/test-prep/page.tsx")).toContain("dashboardAction");
  });
});
