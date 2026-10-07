# Batch 64 — Deterministic Publication Evidence Snapshot

This is a combined hardening batch to move faster without widening scope.

## Review snapshot
Both Admin readiness and atomic publication persistence now resolve completed
reviews using:
1. `reviewedAt DESC`
2. `createdAt DESC`
3. `id DESC`

The final ID tie-breaker removes unspecified ordering even when timestamps are
identical.

## Source evidence
Source/evidence rows are now ordered by `sources.id`, making the evidence
snapshot stable across equivalent database query plans. This does not change
which sources qualify or publication eligibility.

Existing contract tests are strengthened in-place.

No schema, migration, RBAC, calculator publication policy, source/review data,
or persisted publication state is changed.
