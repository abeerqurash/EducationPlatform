# Batch 34 — Admin Latest Review Record

Batch 34 extends the protected publication detail screen with the persisted
latest calculator-version review record.

The Admin detail view now shows, when available:

- review status;
- completed review date/time;
- reviewer user ID;
- review notes.

The repository reads these values directly from the existing `reviews` table.
No reviewer identity, notes, approval or completion date is inferred when the
database does not contain it.

The existing editorial gate, verification states, source evidence, publication
actions and RBAC enforcement remain unchanged.

This batch is read-only. It does not create, edit, approve, reject or otherwise
mutate review records.
