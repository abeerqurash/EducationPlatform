# Batch 100 — Dashboard filter consolidation and calendar hardening

- Replaced duplicated exam and preset pill markup with `ThemedFilterPill`, retaining the existing charcoal active state and white active text.
- Improved the shared calendar's strict ISO date validation, selected-month synchronization, and Escape keyboard focus restoration.
- Reused the existing themed calendar for goal creation/editing and SAT/ACT date filtering; no native date fields introduced.
- Added regression contracts for reusable filter styles, keyboard support, and study-plan date fields.
- No migrations, package changes, or runtime API changes.

Validation: npm run test --workspace=@education/database; npm run test --workspace=@education/calculators; npm run typecheck; npm run lint; npm run build.
