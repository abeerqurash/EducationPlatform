# Batch 147 — Activity-derived learning recommendations

Cumulative update based on Batch 146. Adds a deterministic study-recommendations module, a reusable responsive dashboard panel, and 12 unit tests. Recommendations are grounded only in the signed-in account's selected 7/30/90-day study window. They are not AI diagnoses or evidence of learning achievement. No persistence, migration, external service, or dependency change. Existing exports and actions are untouched.

Validate locally with database/calculator tests, typecheck, lint and build. Do not overwrite `.env.local`.
