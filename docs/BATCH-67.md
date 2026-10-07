# Batch 67 — Admin Queue Pagination Boundary Hardening

Batch 67 moves the publication Admin queue closer to a production-safe runtime
boundary.

The repository now normalizes page input before offset calculation. Runtime
callers that bypass TypeScript cannot produce zero/negative page offsets:
non-integer, zero, or negative page values fall back to page 1.

The normalized page is also used for returned pagination metadata when that
metadata is emitted by the repository.

A dedicated standalone contract protects the boundary and ensures raw
`input.page - 1` offset calculations do not return.

No schema, migration, RBAC, calculator publication policy, publication state,
filter semantics, sorting semantics, or persisted data is changed.
