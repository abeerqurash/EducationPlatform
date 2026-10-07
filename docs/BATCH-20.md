# Batch 20 — Publication RBAC Seed

Adds the two Batch 19 publication permissions to the PostgreSQL RBAC system idempotently.

Permissions:
- `calculators.review.submit`
- `calculators.publish`

Deliberate role policy:
- `editor`: submit for review only
- `admin`: submit + publish
- `owner`: submit + publish
- `support`: no publication grant
- `customer`: no publication grant

Safety:
- existing permissions are preserved;
- existing role-permission assignments are preserved;
- the seed never deletes or replaces RBAC rows;
- missing roles are reported rather than silently created;
- Editor cannot receive `calculators.publish` from this seed;
- no user is automatically assigned a role;
- no calculator/source/review is automatically verified or published.

Run the seed only after the normal test/typecheck/lint/build gate passes:

`npx tsx packages/database/src/seeds/run-publication-rbac.ts`

It is safe to rerun because permission keys are updated in place and role-permission pairs are checked before insertion.
