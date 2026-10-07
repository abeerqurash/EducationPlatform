# Batch 37 — Publish Confirmation Guard

Batch 37 adds an explicit confirmation step before the Admin publication UI
sends a `publish` action.

When a user with publish permission is viewing a tool in `review` state:
- the initial Publish button opens an inline confirmation guard;
- Confirm publish sends the existing secured server action;
- Cancel closes the confirmation without mutating state;
- controls are disabled while the request is pending.

This is a browser-side accidental-click safeguard only. It does not provide
authorization or editorial authority. The existing server action, persisted
RBAC checks, editorial gate and atomic publication transition remain the
security boundary.

Submit for Review behavior is unchanged. No database schema, publication
policy, verification status, review record, formula or source is changed.
