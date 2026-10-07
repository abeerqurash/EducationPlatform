# Batch 30 — Admin Publication Version Consistency

Batch 30 hardens the publication-management list query.

Previously, the Admin list joined every calculator version belonging to a tool
and then removed duplicate tool rows in JavaScript. For tools with multiple
calculator versions, that could display a verification state belonging to a
version other than `tools.currentVersion`.

The query now joins a calculator version only when all three conditions match:

- the calculator belongs to the tool;
- its version equals `tools.currentVersion`;
- it is active.

The application-side deduplication workaround has been removed.

This makes the verification status shown by `/admin/publication` consistent
with the calculator version selected by the secured publication transaction
and the Batch 28 readiness-detail screen.

This batch is read-only hardening. It does not change publication actions,
RBAC, editorial verification data, review data, or database state.
