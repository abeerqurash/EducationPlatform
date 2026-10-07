# Batch 60 — Completed Latest Review Semantics

The Admin publication detail/readiness repository now excludes incomplete
reviews from `latestReview` by requiring `reviews.reviewedAt` to be non-null.

This makes the readiness snapshot use completed review evidence instead of
allowing a pending/unreviewed row to become the latest review merely because it
was created most recently.

A repository contract protects the completed-review predicate.

No database schema, RBAC, publication transition rule, formula/source
requirement, review record, or persisted publication state is changed.
