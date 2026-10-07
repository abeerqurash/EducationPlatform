# Batch 33 — Admin Publication Review Context

Batch 33 improves the protected per-tool publication detail screen with the
editorial context needed before taking publication actions.

The detail view now surfaces:
- tool category;
- applicable year;
- active calculator version;
- tool last-reviewed date;
- active formula version;
- latest review completion date when present.

These values come from the existing persisted publication-detail repository.
Missing values are shown explicitly rather than inferred or fabricated.

The existing editorial-gate blockers, source evidence, verification states,
RBAC checks and secured Submit for Review / Publish actions remain unchanged.

This batch is read-only presentation hardening and does not create approvals,
verification state, review records, sources, formulas or publication state.
