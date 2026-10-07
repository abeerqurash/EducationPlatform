# Batch 61 Fix 1 — Correct Transaction Review Contract Scope

Batch 61 runtime code is retained: the atomic publication transaction requires
`reviews.reviewedAt` to be non-null when resolving the latest review.

The Batch 61 contract test was accidentally registered inside the existing
typed persistence-error test. Fix 1 removes that nested test and places its
assertions inside the existing transaction-resolution contract test, where the
completed-review snapshot requirement belongs.

No production/runtime code, database schema, RBAC, publication transition
rule, formula/source requirement, review record, or persisted state is changed
by this fix.
