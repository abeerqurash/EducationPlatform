# Batch 139 — dashboard overview real data and themed navigation

Cumulative over Batch 138. Replaces the unthemed **View all tools** header link with a reusable, keyboard-accessible `PanelActionLink` (42px minimum height, visible focus ring, hover/active and reduced-motion behavior).

Dashboard overview now retrieves saved-result overview, goal summary and seven-day study progress in parallel, rather than showing hard-coded zero values for practice sessions and streaks. The former practice-session card is renamed **Open study goals** to avoid claiming an unsupported practice-session metric. The streak uses consecutive UTC calendar days, accepting yesterday as the most recent day; weekly activity shows actual count, minutes and active-day coverage. These are explicitly recorded activities, not a timer or attendance measurement.

Includes seven tests for date boundaries, empty activity, stale streaks, aggregates and UI reuse. No migrations or dependencies. Do not replace `.env.local` during extraction. Validate database/calculator tests, typecheck, lint and production build locally.
