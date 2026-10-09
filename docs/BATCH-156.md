# Batch 156 — Account weekly target alignment

Cumulative upgrade on Batch 155. The schedule workspace now compares a user's proposed recurring weekly schedule to their saved weekly study target. The existing account-scoped profile target is passed through the progress page and action-plan workspace, avoiding additional database queries or schema changes.

The target review includes coverage, remaining minutes, estimated minutes to add per selected day, accessible progress indication, and local TXT/CSV exports. All values are advisory; no planned minutes are written to activity records. Twelve regression tests cover exact/above/below targets, empty schedules, validation, final per-day overrides, and exports.

No new dependencies or migrations. Preserve the local .env.local. Validate with database and calculator Vitest, TypeScript, ESLint and Next.js build.
