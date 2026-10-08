# Batch 82 Fix 1

Fixes the two integration regressions reported by the Batch 82 gate.

- `/admin/users` is now tested as the real `AdminShell`-backed operational
  module introduced in Batch 82 instead of as the old generic
  `AdminSectionPage` placeholder.
- Replaces unsupported `shield` AppIcon usage with the existing supported
  `settings` icon.
- Adds regression coverage for both boundaries.

No database migration, RBAC behavior, privilege rule, calculator logic,
publication logic, or UI workflow is changed.
