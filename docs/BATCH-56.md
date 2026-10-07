# Batch 56 — Publication Web Boundary Cleanup

The Admin publication server action no longer reaches directly into the
database persistence adapter to import publication conflict error classes.

Those same error classes are re-exported through the trusted service layers and
the existing server-only session boundary. Runtime class identity is preserved,
so the current `instanceof` handling and response codes remain unchanged.

This tightens the application boundary without changing publication behavior.

No database schema, publication eligibility policy, RBAC permission,
verification requirement, review/source/formula record, or persisted
publication state is changed.
