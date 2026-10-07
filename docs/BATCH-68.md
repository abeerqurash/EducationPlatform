# Batch 68 — Admin Query Boundary Hardening

Batch 68 groups several confirmed Admin publication-list boundary improvements.

- Page query values now require a complete positive-integer string instead of
  `parseInt`, so values such as `2abc`, decimals, zero, negatives, and unsafe
  integers fall back to page 1.
- Search input is trimmed and bounded to 100 characters before filtering.
- Pagination links preserve the normalized/bounded search value rather than
  reusing raw query input.
- Sort normalization is performed once and reused.

These changes remain server-rendered and read-only. They do not change
publication workflow, permissions, persistence, database schema, migrations,
or calculator publication policy.
