/** UTC calendar-day windows, inclusive of today. No locale or client clock assumptions. */
export type TestPrepDatePreset = "7d" | "30d" | "90d";

export function getTestPrepDatePreset(preset: TestPrepDatePreset, now: Date = new Date()) {
  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const from = new Date(today - (days - 1) * 86_400_000).toISOString().slice(0, 10);
  const to = new Date(today).toISOString().slice(0, 10);
  return { from, to };
}

export function activeTestPrepDatePreset(from?: string, to?: string, now: Date = new Date()): TestPrepDatePreset | null {
  for (const preset of ["7d", "30d", "90d"] as const) {
    const range = getTestPrepDatePreset(preset, now);
    if (range.from === from && range.to === to) return preset;
  }
  return null;
}
