# Batch 81 — Publication integrity + admin RBAC migration foundation

## Publication requirements
One server-owned resolver now defines whether a calculator engine requires an
active formula and verified source evidence. Formula calculators remain strict.
Dataset-driven engines can explicitly declare `featureFlags.datasetDriven`.

For backward compatibility, the existing Digital SAT range-estimator policy
(`rangeOutput: true`, `officialScoreClaim: false`) is recognized as
dataset-driven without a database migration.

The same resolver is used by:
- public calculator readiness
- admin publication readiness
- atomic publication mutation

Browser/request input cannot weaken these requirements.

## Public evidence integrity
Public runtime now resolves:
- active formula deterministically by createdAt + id
- verified sources only, deterministically by id
- completed approved reviews only
- review ordering by reviewedAt + createdAt + id

The calculator version join is tied to `tools.currentVersion`, preventing an
arbitrary active version from becoming the public runtime record.

## Admin workspace RBAC
Introduces the dedicated `platform.admin.access` permission policy and an
idempotent Platform Admin RBAC seed.

No user is silently assigned this permission. Existing calculator publication
administrators remain allowed in explicit `publication-compatibility` mode so
this batch cannot lock out the current admin workspace. A later controlled
rollout can assign `platform_admin` and then remove compatibility.

## Database
No schema migration is required.
