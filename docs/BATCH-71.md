# Batch 71 — Admin Queue Accessibility & Canonical Controls

Batch 71 groups confirmed accessibility and canonical-control improvements for
the publication queue.

- The publication search field now has an explicit accessible name.
- Result-count feedback is exposed as a polite atomic live region so updated
  filter/search results are announced without interrupting the user.
- The existing reset action remains a canonical `/admin/publication` link,
  clearing stale query state rather than carrying old parameters forward.
- Where the existing pagination is rendered as navigation, it now has an
  explicit accessible navigation label.
- Existing search normalization, server/browser length limits, strict page
  parsing, page cap, filter allowlists, sorting, result ranges, and page
  clamping remain intact.

No schema, migration, RBAC, publication workflow, calculator policy, repository
API, or persisted state changes.
