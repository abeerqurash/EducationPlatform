# Batch 141 — Interactive study activity calendar

- Adds a responsive, keyboard-accessible day-by-day heatmap to the authenticated Progress dashboard.
- Reuses the already account-scoped 7/30/90-day UTC reporting window. No additional query or API route.
- Daily square buttons expose precise minutes/activity counts via accessible labels and a selected-day detail panel.
- Adds activity coverage and a documented fixed minute-intensity scale. No inferred sessions or automatically tracked time.
- Pure helper unit tests cover thresholds, empty windows, totals, immutability and invalid values.
- No schema migrations, dependencies or modifications to environment configuration.

Validate with database and calculator Vitest suites, `npm run typecheck`, `npm run lint`, and `npm run build`.
