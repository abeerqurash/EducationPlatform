# Batch 129 — Filter-aware study goal exports

- Export the current search/status/deadline/sort result set to CSV, JSON or TXT directly from the Study Goal workspace.
- Downloads contain **all matching goals**, not only the currently paginated page.
- No data is sent to external providers; exports are generated locally from the authenticated dashboard's account-scoped goal list.
- CSV escapes quotes and neutralizes spreadsheet formulas; JSON includes version, generation timestamp and applied filters.
- Existing full-history CSV/JSON/TXT server exports remain unchanged.
- Empty results disable the new export controls.
- No schema migration or dependencies. Unit tests cover filtered selection, CSV safety, text, empty data and filenames.
