import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve(process.cwd(), "../../apps/web/src");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
describe("shared custom export dropdown", () => {
  it("submits selected values using a hidden input while showing a custom listbox", () => {
    const source = read("components/shared/themed-export-select.tsx");
    expect(source).toContain('type="hidden" name={name}');
    expect(source).toContain('role="listbox"');
    expect(source).toContain('role="option"');
    expect(source).toContain('aria-selected={index === activeIndex}');
    expect(source).not.toContain("<select");
  });
  it("supports keyboard navigation, escape, focus return, and outside dismissal", () => {
    const source = read("components/shared/themed-export-select.tsx");
    for (const key of ["Escape", "ArrowDown", "ArrowUp", "Home", "End", "Enter", "Tab"]) expect(source).toContain(key);
    expect(source).toContain('document.addEventListener("pointerdown"');
    expect(source).toContain('trigger.current?.focus()');
  });
  it("uses the same custom dropdown on both export pages", () => {
    for (const page of ["study-plan", "progress"]) {
      const source = read(`app/dashboard/${page}/page.tsx`);
      expect(source).toContain("<ThemedExportSelect");
      expect(source).not.toContain("<select");
    }
  });
});
