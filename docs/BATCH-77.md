# Batch 77 — 10× application workspace expansion

This batch turns the UI foundation into a navigable application rather than
leaving dashboard/admin sidebar destinations as 404s.

## Customer workspace
Adds protected pages for My tools, Test prep, Study plan, Progress, Saved
results and Settings. They share one authenticated page primitive and use
truthful empty states instead of fabricated account activity.

## Admin workspace
Adds protected pages for Tools & calculators, Content, Analytics, SEO,
Monetization, Users & access, Support and Settings. They share one admin page
primitive and intentionally avoid fake operational metrics.

## Admin authorization hardening
The `/admin` overview and all new admin modules now reuse the same
database-backed actor/permission rule already established by Publication:
the authenticated actor must have submit-for-review or publish permission.
Unauthorized authenticated users return to `/dashboard`.

## Responsive navigation
Both application shells now expose compact horizontally scrollable navigation
below the desktop sidebar breakpoint, so all workspace destinations remain
reachable on smaller screens without introducing a client-side drawer yet.

## Design continuity
Batch 76 Fix 6 remains intact, including the frontend-derived continuous
button shimmer, smooth hover/fill transitions, background-aware variants and
foreground specificity fix.

No database schema, migrations, calculator formulas, publication persistence,
publication state transitions, or fabricated analytics data are introduced.
