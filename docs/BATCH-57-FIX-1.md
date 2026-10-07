# Batch 57 Fix 1 — Correct Regression Test Scope

The Batch 57 request-policy assertions were accidentally wrapped in a nested
`it()` inside the typed persistence-error test. Vitest does not allow test
registration from inside another test.

Fix 1 removes that nested test and moves the two assertions into the existing
`keeps publication requirements strict and server owned` contract test.

Production code is unchanged. The intended regression protection remains:
request input must not control `requireFormula` or `requireVerifiedSource`.

No database schema, runtime publication behavior, RBAC, verification policy,
review/source/formula record, or persisted data changes are included.
