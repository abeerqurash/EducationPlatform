# Batch 74 — Publication Action Form Semantics

Batch 74 groups accessibility hardening across the confirmed Submit for Review
and Publish action surface.

- The optional action-reason textarea now has a stable control ID and an
  explicitly associated visible label.
- The existing 1000-character client boundary remains intact and aligned with
  the previously established server validation.
- Existing action feedback receives polite live-region semantics when rendered,
  without changing feedback copy or workflow.
- Existing blocker output receives an accessible list name when the current
  component renders it as a list.
- A standalone contract protects the action-form semantics without altering
  existing test blocks.

No action transition, confirmation behavior, request payload, server
validation, RBAC, database schema, migration, calculator policy, audit behavior,
or persisted state changes.
