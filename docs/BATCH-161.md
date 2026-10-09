# Batch 161 — Timed SAT/ACT practice and review

Cumulative release from Batch 160 Fix 1. Adds timed or untimed sessions, explicit start, a countdown with automatic submission at deadline, elapsed time, one-question-at-a-time navigation, answer completion indicators, review navigation, topic-level analytics, and detailed TXT/copy exports. Timer uses absolute wall-clock deadline to avoid interval drift and clears its interval on component cleanup. The original educational question bank remains unchanged. Practice results are transient browser state and are not saved to a student account; these are not official SAT/ACT scores. No database migration or new dependencies.

New regression coverage: `packages/database/src/publication/exam-practice-analytics.test.ts`.

Validate locally: `npm run test --workspace=@education/database`, `npm run test --workspace=@education/calculators`, `npm run typecheck`, `npm run lint`, `npm run build`.
