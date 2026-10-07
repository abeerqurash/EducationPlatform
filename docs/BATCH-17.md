# Batch 17 — Review / Publication Workflow Core

Batch 17 builds on Batch 16 and adds the pure workflow layer for calculator publication.

Included:
- draft/scheduled/review -> review planning
- archived and already-published safety blocks for the submit-for-review action
- strict review -> published planning through the Batch 16 editorial gate
- last-reviewed timestamp propagation from the approved review
- dataset-driven calculator support (`requireFormula: false`)
- deterministic audit/change-history payload planning
- tests for allowed and blocked transitions

Important:
This batch intentionally keeps the workflow pure. It does not yet write to PostgreSQL and does not invent an authenticated reviewer/admin. That separation lets us test the state machine completely before the next persistence adapter performs the tool update + audit log + change history atomically in one database transaction.
