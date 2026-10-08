# Batch 102 — Saved exam result sorting

- Add validated newest-first / oldest-first query parameter, default newest.
- Stable SQL ordering by creation timestamp and record ID for both paginated history and capped CSV export.
- Preserve sort across SAT/ACT filters, date presets, custom date range, pagination, and CSV export.
- Owner-scoped saved-only SQL restrictions remain unchanged.
- No database migrations or new dependencies.
