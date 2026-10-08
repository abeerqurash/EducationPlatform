# Batch 91 Fix 1

Fixes PostgreSQL grouping error in the daily study trend: the selected UTC day is now derived from the same `date(created_at at time zone UTC)` expression used by GROUP BY and ORDER BY, cast to text for the existing `YYYY-MM-DD` chart keys. Adds a regression contract. No migration.
