# Batch 77 Fix 1

Corrects integration defects found by the Batch 77 gate:

- fixes the database publication imports from `apps/web/src/lib`;
- narrows the authenticated user at the shared admin access boundary so
  downstream Server Components do not receive a nullable session;
- replaces the readonly-tuple `flatMap` mobile admin navigation expression
  with nested mapping that preserves TypeScript inference;
- updates the older application UI foundation contract to recognize the
  stronger shared admin authorization boundary introduced in Batch 77.

No UI design, button animation, calculator behavior, publication transition,
database schema, migration, persistence, or RBAC policy is changed.
