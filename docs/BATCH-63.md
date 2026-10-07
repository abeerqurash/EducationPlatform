# Batch 63 — Deterministic Active Formula Selection

Both trusted publication paths already select the newest active formula by
`formulaVersions.createdAt DESC`. Batch 63 adds `formulaVersions.id DESC` as a
stable tie-breaker when two active formula rows have the same creation
timestamp.

Admin readiness and atomic publication persistence now use the same
deterministic formula-selection rule. Existing contract tests are strengthened
in-place.

No schema, migration, RBAC, calculator publication policy, formula data,
review data, or persisted publication state is changed.
