# Batch 159 — SAT/ACT practice planner

Cumulative update from Batch 158. Introduces `/dashboard/test-prep/practice-planner` (authentication required), topic selection, bounded 3–30 day scheduling, per-day capacity, clear overflow, TXT/CSV/JSON exports and clipboard copy. Includes 12 Vitest regression tests.

The planner is an organizational aid only: it does not claim to administer official exams, predict scores, grade answers, log actual study time, or persist schedules. Topics are general study categories; optional ACT science is labeled accordingly. No migrations, dependencies, or secret files are included.

Validate locally with `npm run test --workspace=@education/database`, `npm run test --workspace=@education/calculators`, `npm run typecheck`, `npm run lint`, `npm run build`.
