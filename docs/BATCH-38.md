# Batch 38 — Review Submission Confirmation Guard

Batch 38 extends the Admin publication action safeguards to
`submit_for_review`.

For an eligible tool:
- Submit for review first opens an inline confirmation;
- Confirm submission invokes the existing secured server action;
- Cancel closes the confirmation without changing publication state;
- action controls remain disabled while a request is pending.

The Publish confirmation introduced in Batch 37 remains unchanged.

These confirmations are accidental-action safeguards only. Authorization and
editorial authority continue to be enforced by the server-side session
boundary, persisted RBAC permissions, workflow rules and trusted publication
persistence.

No database schema, RBAC policy, verification state, review record, source,
formula or publication policy is changed by this batch.
