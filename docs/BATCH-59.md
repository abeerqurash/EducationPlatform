# Batch 59 — Admin Readiness Policy Alignment Contract

Batch 59 adds a regression contract for the Admin publication detail/readiness
repository.

Until the existing calculator-specific publication policy is deliberately
integrated into both paths, Admin readiness must remain aligned with the trusted
mutation boundary: `requireFormula` and `requireVerifiedSource` stay strict,
server-owned requirements and cannot be supplied by request/input policy
fields.

This prevents the Admin UI from silently reporting a weaker readiness state
than the production mutation boundary.

This is a contract-only batch. It does not change runtime publication
eligibility, database schema, RBAC, verification records, reviews, sources,
formulas, or persisted publication state.
