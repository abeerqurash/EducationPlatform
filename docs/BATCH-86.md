# Batch 86 — Accurate student progress metrics

Replaces truncated in-memory weekly activity totals with SQL aggregates over
all qualifying activities, while preserving the latest 100 activities as a
bounded preview. Adds an independent SQL summary for completed non-archived
goals instead of counting only the 20 latest visible goals. Improves progress
bar accessibility with native ARIA range semantics.

No schema migration. No changes to the public frontend, calculator formulas,
admin authorization, or stored study records.
