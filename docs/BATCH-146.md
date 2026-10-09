# Batch 146 — Configurable calendar benchmarks

Cumulative release from Batch 145 Fix 1.

- The study activity calendar offers 15/30/45/60/90-minute benchmark presets. Benchmark selection is local to the current dashboard view and does not change persisted study goals.
- Calendar squares can show all, active, target-met, or below-target dates. Filtered dates do not alter reporting totals, weekly summaries, or milestone streaks.
- Selecting a date reveals a progress bar, remaining minutes, and any recorded minutes above the chosen benchmark.
- Pure, reusable calendar filtering and benchmark calculations have fourteen regression tests.
- No migrations, new dependencies, remote pushes, or environment-file changes.

Validate: `npm run test --workspace=@education/database`, `npm run test --workspace=@education/calculators`, `npm run typecheck`, `npm run lint`, `npm run build`.
