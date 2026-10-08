# Batch 116 — Copy saved result JSON

- Added accessible Copy JSON button to each saved SAT/ACT result, when details are available.
- Reuses the versioned JSON serializer already used by Download JSON, preventing format drift.
- Uses existing clipboard failure feedback and reset timer.
- Added three source-contract tests. No schema, migration, dependency, or API changes.
- Cumulative source overlay based on Batch 115 Fix 1; preserve .env.local and newer local changes.
- Local Vitest, TypeScript, ESLint, and production build must be run by the user.
