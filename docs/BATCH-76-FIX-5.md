# Batch 76 Fix 5 — Exact frontend button interaction language

This batch was based on the latest `main` branch of
`abeerqurash/EducationPlatform`.

The public frontend already defines a button interaction system in
`apps/web/src/app/globals.css`: continuous 4.8s ambient shimmer, expanding
hover-fill, cubic-bezier lift/scale motion, active compression, focus ring,
and reduced-motion handling.

Fix 5 reuses that interaction language in application surfaces:
- customer dashboard primary and secondary CTAs;
- customer dashboard top Browse tools CTA;
- admin dashboard primary CTA;
- admin top Publication queue CTA;
- all existing auth submit buttons through the `(auth)` scoped stylesheet,
  which covers login/register and any forgot/reset forms that expose submit
  buttons.

The shared `SiteButton` supports primary, secondary, accent/light, and
ghost-on-dark variants so button colors remain appropriate to their surface
rather than forcing one color everywhere.

No auth handlers, sessions, publication workflow, RBAC, database persistence,
schema, migrations, calculator policy, or audit behavior changes.
