# Batch 44 — Confirmation Snapshot Lock

Once Submit for review or Publish confirmation is open, the Action reason field
is locked until the operator cancels or completes the confirmation. This keeps
the editable field aligned with the normalized reason shown in the confirmation.

The UI explicitly tells the operator to cancel the confirmation to edit the
reason. Server-side validation, authorization, RBAC, editorial rules and
publication persistence remain authoritative.

No schema, publication-policy, RBAC, verification, review, source, formula or
persisted-state change is introduced.
