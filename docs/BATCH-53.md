# Batch 53 — Editorial Blocker Refresh

Batch 53 extends stale-snapshot recovery to trusted `transition_blocked`
responses.

A transition can become blocked after the Admin detail page was rendered if
verification, source, formula or review state changes before the mutation is
attempted. The client already renders the trusted blocker messages returned by
the server. It now also closes any open confirmation and refreshes the route so
the surrounding readiness/evidence UI is reloaded from persisted state.

The action reason remains preserved because the mutation did not succeed.

No database schema, publication eligibility policy, RBAC permission,
verification requirement, review/source/formula record, or persisted
publication state is changed.
