# Batch 58 — Strict Policy Default Contract

Batch 58 strengthens the atomic publication persistence regression contract.

The trusted persistence boundary is now contract-tested for both sides of the
current server-owned publication policy:

- request input cannot provide `requireFormula` or `requireVerifiedSource`;
- the current production persistence implementation retains strict `true`
  defaults for both requirements.

This prevents a future refactor from silently weakening the production
publication gate before the existing calculator-specific policy is deliberately
integrated into both mutation and Admin readiness paths.

This is a contract-only batch. It does not change runtime publication
eligibility, database schema, RBAC, verification records, reviews, sources,
formulas, or persisted publication state.
