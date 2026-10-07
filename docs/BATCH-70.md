# Batch 70 — Canonical Admin Search & Result Range

Batch 70 groups confirmed Admin publication-list UX and query-boundary work.

- Search input now has a browser-side `maxLength` matching the server-owned
  100-character boundary.
- The server keeps a case-preserving normalized search value for the form and
  generated pagination URLs, while a lowercase derivative is used only for
  matching.
- Raw query text is no longer echoed back into the search control.
- Search autocomplete is disabled for this editorial filter field.
- Result feedback now reports the visible range on the current page, the
  filtered result count, and the total queue count instead of describing the
  entire filtered set as currently shown.
- Existing strict page parsing, page cap, filter allowlists, sorting, and
  current-page clamping remain unchanged.

No schema, migration, RBAC, publication workflow, calculator policy, repository
API, or persisted state changes.
