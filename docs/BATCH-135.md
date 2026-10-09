# Batch 135 — Deadline group management

- Collapsible deadline groups with accessible expanded state and associated content IDs.
- Select or deselect the goals in an individual deadline group on the current page.
- Group selection preserves other groups, deduplicates IDs, and respects the existing 50-goal server limit.
- Per-group unselected count, including overflow when the limit is reached.
- Seven focused pure helper tests.
- No migrations, new dependencies, or environment file changes.

## Validate

```powershell
npm run test --workspace=@education/database
npm run test --workspace=@education/calculators
npm run typecheck
npm run lint
npm run build
```

Group selection affects only the current page, consistent with the grouped display; use the existing select-matching-across-pages action to select goals across pages.
