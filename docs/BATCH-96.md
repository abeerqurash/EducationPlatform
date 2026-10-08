# Batch 96 — Test-prep result history navigation

- Adds bounded, server-side pagination (15 per page) for saved SAT/ACT calculator outputs.
- Adds All / SAT / ACT URL-based filters, with accessible current-filter indication and previous/next links.
- Counts and rows both enforce authenticated user ownership and saved-only state; no client-supplied user ID.
- Reuses existing tables, migrations, and scoring logic; no schema changes.
- Adds input normalization and ownership contract regression tests.
- Out-of-range pages intentionally show an empty page with a previous link; no unbounded query.
