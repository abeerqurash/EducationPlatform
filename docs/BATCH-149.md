# Batch 149 — Weekly study schedule

- Adds a local-only, seven-day schedule builder below the existing personalized study action plan.
- Select weekdays, choose 15–120 planned minutes per study day, and review action suggestions distributed across chosen days.
- Download TXT or JSON schedules, reset the selection, or select no days for an explicit empty state.
- Planned time is explicitly distinct from recorded activity. No account writes, migrations, external APIs, or dependencies.
- Includes 16 regression tests for ordering, totals, validation, empty states, output, and privacy-oriented wording.

## Validation on Windows

```powershell
npm run test --workspace=@education/database
npm run test --workspace=@education/calculators
npm run typecheck
npm run lint
npm run build
```

Do not overwrite `.env.local`. This ZIP is cumulative from Batch 148.
