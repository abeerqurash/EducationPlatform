# Batch 65 — Canonical Evidence Ordering Contract

Batch 65 consolidates the deterministic evidence work from Batches 60–64.

Source evidence ordering is now explicit with `asc(sources.id)` in both Admin
readiness and atomic publication persistence instead of relying on a bare
column order expression. Existing contracts also protect the active-formula ID
tie-breaker and canonical source ordering in the same trusted paths.

This is intentionally a consolidation batch while the exact local
calculator-policy implementation remains untouched.

No schema, migration, RBAC, calculator publication policy, source/formula/review
data, or persisted publication state is changed.
