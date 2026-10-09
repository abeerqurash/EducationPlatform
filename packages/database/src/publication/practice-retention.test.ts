import { describe, expect, it } from "vitest";
import { practiceRetentionCutoff } from "./practice-retention";
describe("practice retention", () => {
  it("subtracts calendar-independent UTC days", () => {
    expect(practiceRetentionCutoff(new Date("2026-10-10T00:00:00Z"), 30).toISOString()).toBe("2026-09-10T00:00:00.000Z");
  });
  it("rejects invalid settings", () => {
    expect(() => practiceRetentionCutoff(new Date(), 0)).toThrow();
    expect(() => practiceRetentionCutoff(new Date("invalid"), 30)).toThrow();
  });
});
