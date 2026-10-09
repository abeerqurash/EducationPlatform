# Batch 162 — targeted exam practice retry

- Adds deterministic question shuffling with no changes to the original question bank.
- Adds targeted practice of incorrect and unanswered questions after submission.
- Preserves timed/untimed quiz behavior and explanation review.
- Adds downloadable retry summary and 12 regression tests.
- Retry sessions are client-side and are not persisted or official SAT/ACT scores.
- No schema migrations or new dependencies.

## Local validation

Run database/calculator tests, typecheck, lint and production build from the existing monorepo root.
