# Batch 131 — Bulk selection safety and review

- Clears pending bulk selections whenever goal search, filter, sorting, or page-size changes.
- Reconciles selected goal IDs against the currently eligible view before submitting bulk requests.
- Adds a selected-goal preview and operation-specific confirmation showing up to five goal titles.
- Disables select-page while a bulk operation is running.
- Adds four unit tests for reconciliation, limits, and confirmation previews.
- No migration or dependency changes.
