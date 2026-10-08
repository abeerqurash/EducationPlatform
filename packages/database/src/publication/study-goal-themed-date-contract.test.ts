import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const root = new URL("../../../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

describe("study goal themed date integration", () => {
  it("uses themed date controls for creation and editing, not native date inputs", () => {
    const page = read("apps/web/src/app/dashboard/study-plan/page.tsx");
    expect(page.match(/<ThemedFormDate name="targetDate"/g)).toHaveLength(2);
    expect(page).not.toContain('type="date"');
    expect(page).toContain('defaultValue={goal.targetDate ?? ""}');
  });
  it("preserves the server action field name and date value", () => {
    const component = read("apps/web/src/components/shared/themed-form-date.tsx");
    expect(component).toContain('type="hidden" name={name} value={value}');
    expect(component).toContain("<ThemedDatePicker");
  });
});
