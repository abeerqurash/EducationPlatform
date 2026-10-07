# Batch 57 — Server-Owned Policy Regression Guard

Batch 57 strengthens the atomic publication persistence contract by explicitly
rejecting request-controlled `input.requireFormula` and
`input.requireVerifiedSource` usage.

This protects the trusted mutation boundary from future policy injection while
calculator-specific publication policy remains server-owned.

The local calculator-policy implementation is deliberately not overwritten:
its exact API is not contained in the cumulative artifact available here.

No database schema, publication eligibility behavior, RBAC permission,
verification requirement, review/source/formula record, or persisted
publication state is changed.
