# Batch 76 Fix 2 — Application chrome + publication integration

Visual corrections from the user's frontend review:

- Public AnnouncementBar/Header/Footer are preserved exactly for public routes.
- `/dashboard`, `/admin/*` and authentication routes are standalone application
  surfaces, preventing the public header from overlapping their own shells.
- Shared app branding follows the existing Education Platform black/lime identity.
- Primary app CTA hover behavior remains near-black instead of introducing a
  separate violet button language.
- Publication queue/detail now enter AdminShell at the exported page boundary.
  No arbitrary helper-function `return (` is modified.

No publication workflow, RBAC, persistence, schema, migration, calculator
policy, audit behavior, or persisted state changes.
