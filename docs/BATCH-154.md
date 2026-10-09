# Batch 154 — Weekly study schedule comparisons

Cumulative release based on Batch 153. Adds a template-based schedule comparison within the existing Progress weekly planner. The comparison is read-only and local to the browser: it does not persist or alter saved study sessions, goals, or account settings.

Features: selectable reference schedule using the existing themed dropdown; current versus reference minutes, absolute delta, days added or removed, changed daily durations, plain-text and CSV comparison downloads. CSV formula-prefix protection is applied to user-supplied labels. Ten regression tests cover zero baselines, changed days, delta calculation, formatting, and escaping.

No new dependencies or migrations. Preserve existing `.env.local`. Run database and calculator tests, typecheck, lint and build locally before deployment.
