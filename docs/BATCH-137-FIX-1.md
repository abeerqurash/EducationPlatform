# Batch 137 Fix 1 — activity history source-contract tests

The Progress page delegates the bounded, owner-scoped activity list to `StudyActivityHistory`. Three legacy source-contract tests incorrectly required activity row markup and a hard-coded slice in the page source. They now check the page-to-component boundary, component pagination, manual-only confirmation rendering, and retain repository-level ownership/manual-source safeguards. No runtime behavior, schema, or dependencies changed.
