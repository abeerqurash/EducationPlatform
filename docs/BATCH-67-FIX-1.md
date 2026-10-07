# Batch 67 Fix 1 — Remove Inapplicable Pagination Contract

The Batch 67 gate proved that `admin-repository.ts` currently exposes
`listAdminPublicationTools()` with no pagination input and no offset
calculation.

The Batch 67 pagination contract therefore asserted behavior for an API that
does not exist. Fix 1 removes that invalid contract test.

Production/runtime code remains exactly as it was in Batch 67. No pagination
behavior is invented, and no unrelated repository behavior is changed.

No schema, migration, RBAC, publication policy, filtering/sorting semantics,
or persisted data is changed.
