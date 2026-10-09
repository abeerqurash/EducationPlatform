# Batch 140 — Filtered Study Activity Insights

This cumulative release extends the client-side Progress activity history with a compact, accessible insights panel.

- Uses only the account-scoped recent records passed from the server, after the active search and activity-type filters are applied.
- Shows recorded minutes, session and calculator counts, average duration, active UTC days, busiest UTC day, and longest activity.
- Metrics cover all filtered records, not just the visible pagination page.
- Existing export behavior, manual-session deletion, pagination, and themed dropdowns are unchanged.
- Pure summary helper has nine unit tests, including empty and malformed inputs.

No schema migrations, new dependencies, or environment file changes.

Validate locally: database tests, calculator tests, typecheck, lint, build. The ZIP build environment does not contain the full node_modules installation.
