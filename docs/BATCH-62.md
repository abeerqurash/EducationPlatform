# Batch 62 — Deterministic Completed Review Ordering

Batch 62 makes latest completed-review selection deterministic in both trusted
publication paths.

Batch 60/61 require `reviewedAt` to be non-null. Batch 62 now orders eligible
reviews by `reviewedAt DESC` first and `createdAt DESC` second. This means the
most recently completed review wins, with creation time as a deterministic
tie-breaker.

Admin readiness and atomic publication persistence use the same ordering rule.
Existing contract tests are strengthened in-place.

No database schema, migration, RBAC, calculator publication policy, review
record, or persisted publication state is changed.
