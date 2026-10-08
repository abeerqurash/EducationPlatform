# Batch 104 Fix 1

Fix TypeScript TS2322 by accepting the normalized numeric `history.pageSize` in `ThemedDateRange`. The database query normalization still restricts page sizes to 15, 30, or 50. No schema, UI, or dependency changes. Added a source contract assertion to prevent the mismatch from recurring.
