# Batch 84 — RBAC concurrency and disabled-account enforcement

- Serializes bootstrap, role assignment/removal, and account activation with a shared PostgreSQL transaction advisory lock to prevent concurrent last-admin and bootstrap races.
- Final-admin protection counts only active administrators, not disabled accounts.
- Inactive accounts receive no resolved RBAC permissions.
- Duplicate role assignment is a no-op and no longer produces misleading audit entries.
- Replaces raw array interpolation with Drizzle typed `inArray` for role lookup.
- Adds targeted contract tests for these boundaries.

No database migration. Existing UI, public calculator behavior, and role definitions are preserved. The runtime PostgreSQL transaction behavior should be integration-tested before production deployment.
