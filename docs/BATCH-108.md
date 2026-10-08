# Batch 108 — Active history filter summary

- Add compact, themed active-filter chips to the SAT/ACT saved result history.
- Each chip removes only its own filter (exam, UTC date range, sort, or results per page) and resets the page to 1.
- Retain all other normalized filters and existing CSV export behavior.
- Hide the active-filter summary when all filters are at their defaults.
- Add two static regression contract tests; no migrations or dependencies.
