# Batch 78 — Student result persistence foundation

This batch moves the customer dashboard from visual placeholders toward real
account-owned data.

## Database
Adds immutable migration `0003_student_calculator_results` and the
`studentCalculatorResults` schema. Each row belongs to one user, optionally
links to a known tool, stores the calculator/version identity, bounded input
and result snapshots, a human-readable summary, saved state and timestamps.

## Server-owned persistence
Adds repository operations for create, list, count and delete. Reads/deletes
are always constrained by user ID. List size is bounded to 50.

Adds authenticated Server Actions with UUID checks, strict slug/name/summary
bounds, plain-object validation and 25 KB limits for each JSON snapshot.

## Customer dashboard
`/dashboard` now reads the real saved-result count rather than permanently
showing zero.

`/dashboard/saved` is now a real account-owned results page with newest-first
history, empty state and confirmation before removal.

## Calculator integration foundation
Adds a reusable `SaveResultButton` that calculators can render after a valid
calculation. It handles authenticated save, pending state, duplicate-click
guard and accessible status feedback. Individual calculator wiring will be
rolled through the calculator registry in the next batch rather than changing
calculation formulas in this database-focused batch.

No calculator formula, publication workflow, publication RBAC, public SEO
content, or approved application visual system is changed.
