# Batch 48 — Typed Publication Persistence Conflicts

Batch 48 improves server-side publication error semantics.

The trusted persistence layer now distinguishes:
- a publication target that no longer exists;
- a publication status that changed before the conditional update committed.

The protected server action maps those trusted errors to explicit responses:
- `404 / not_found`;
- `409 / state_conflict`.

Other unexpected database/schema/runtime errors continue to be hidden behind
the generic `500 / internal_error` response, so implementation details are not
leaked to the browser.

This batch does not change the publication eligibility policy, RBAC rules,
editorial gate, database schema, verification requirements, review/source/
formula records, or the existing conditional status update.
