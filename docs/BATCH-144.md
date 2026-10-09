# Batch 144 — Weekly activity calendar summaries

Cumulative update built from Batch 143. The Progress calendar now includes UTC Monday-to-Sunday weekly rollups, minutes, active days, activity totals, average per observed day, proportional bars, and safe comparisons only when adjacent reporting weeks contain the same number of observed dates. Weekly cards allow jumping to their busiest date; the calendar also supports jumping to the overall busiest day and clearing a selection.

No migrations, additional API calls, new dependencies, or changes to existing export and deletion behavior. Twelve pure helper tests added. Preserve `.env.local` and existing root files when extracting. Run database and calculator tests, typecheck, lint, and production build locally.
