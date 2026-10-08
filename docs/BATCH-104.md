# Batch 104 — Configurable saved test-prep result page sizes

- Students can choose 15, 30, or 50 results per page using the established themed pill controls.
- Untrusted `size` URL values are normalized server-side to the safe default of 15.
- Server-side count, page clamping, limit and offset all use the normalized page size; owner and saved-only predicates remain unchanged.
- Exam, UTC date, sorting, presets, and pagination retain the selected page size. Changing the size resets pagination to page 1.
- CSV export remains independently capped at 1,000 results and unaffected by UI page size.
- No database migrations or dependencies.
