# Batch 151 Fix 1

Correct `buildWeeklyStudySchedule` to sum each finalized daily duration rather than multiplying the default duration by the number of days. This ensures that the displayed weekly total and TXT/JSON/CSV exports reflect independent day overrides. No migrations or dependencies.

Validation on Windows:

```powershell
npm run test --workspace=@education/database
npm run test --workspace=@education/calculators
npm run typecheck
npm run lint
npm run build
```
