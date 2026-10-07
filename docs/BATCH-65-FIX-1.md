# Batch 65 Fix 1 — Multiline Formula Contract Assertion

The Batch 65 gate showed that runtime code is correct: Admin formula ordering
contains `desc(formulaVersions.id)` in formatted multiline TypeScript.

The contract assertion incorrectly required the compact one-line source string.
Fix 1 changes only that assertion to whitespace-tolerant matching.

No production/runtime code, schema, migration, RBAC, publication policy,
evidence ordering, or persisted state is changed.
