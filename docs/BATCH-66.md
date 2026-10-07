# Batch 66 — Admin Publication Input Boundary Hardening

Batch 66 is a larger boundary-hardening step.

`getAdminPublicationDetail()` now validates `toolId` as a UUID before any
database query. Malformed route/request identifiers therefore terminate as a
normal not-found result instead of being passed into PostgreSQL UUID
comparisons.

A dedicated standalone contract protects two properties:
- UUID validation exists at the repository boundary.
- validation occurs before the first database query.

This complements the existing UUID validation in the trusted mutation path and
keeps malformed identifiers away from both read and mutation persistence
boundaries.

No schema, migration, RBAC, calculator publication policy, editorial state,
formula/source/review data, or persisted publication state is changed.
