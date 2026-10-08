# Batch 107 — Calendar navigation and URL-state synchronization

- Remount the date-range editor when applied URL filters change, preventing stale dates after quick presets, browser history navigation, or exam/sort/page-size changes.
- Use unique React-generated calendar heading IDs so multiple date pickers cannot duplicate accessibility IDs.
- Scroll the selected month/year into view when opening a custom selector.
- Escape from an open selector now dismisses only that selector; a subsequent Escape dismisses the calendar.
- Add static regression coverage for all changes.

No database migrations, new packages, or user-data changes.
