# Batch 51 — Confirmation Action Lock

Batch 51 locks the primary publication action controls while either inline
confirmation is open.

This prevents an operator from opening a confirmation for one transition and
then switching to another primary action underneath that confirmation snapshot.
The action-reason field was already locked by the confirmation snapshot guard;
this batch extends the same snapshot integrity to the primary action controls.

Primary controls also expose their computed disabled state through
`aria-disabled`.

The secured server action remains authoritative. No database schema,
publication eligibility policy, RBAC permission, verification requirement,
review/source/formula record, or persisted publication state is changed.
