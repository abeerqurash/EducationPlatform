# Batch 76 — 10× Application UI Expansion

This batch establishes the second major layer of the final application UI
system instead of shipping small isolated polish changes.

## Shared UI
- New reusable authentication presentation shell.
- New reusable Admin application shell.
- Existing customer shell from Batch 75 remains the customer foundation.
- All shells share the same Education+ brand primitives and application icon
  system rather than becoming unrelated products.

## Admin
- New authenticated `/admin` overview.
- Final sidebar information architecture foundation for publication, tools,
  content, analytics, SEO, monetization, users/access, support and settings.
- Sticky admin header and account identity.
- Existing `/admin/publication` queue moved into the shared Admin shell.
- Existing `/admin/publication/[toolId]` detail moved into the shared Admin
  shell.
- Existing publication page logic is wrapped rather than replaced.

## Authentication
- Reusable split-screen branded AuthShell for login/register/recovery/verify
  surfaces.
- Shared form field and primary action classes ready for adoption by the
  existing auth forms without changing their API behavior.

## Safety / data integrity
- Admin overview deliberately avoids fabricated DB statistics.
- Existing publication request boundaries, transitions, validation and
  persistence are not rewritten.
- No schema, migration, calculator policy, RBAC policy, audit policy or
  persisted-state change is included.

The next accelerated batch can adopt AuthShell in the concrete login/register/
recovery pages and build real customer/admin sub-page shells on this shared
foundation.
