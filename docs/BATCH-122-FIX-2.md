# Batch 122 Fix 2 — custom themed export dropdowns

- Replaced native browser select controls for Study Plan goal status and Progress export period with one reusable client-side `ThemedExportSelect` component.
- The component follows the existing calendar dropdown's rounded borders, dark selected option, subtle hover state, floating menu, and keyboard interactions.
- Hidden inputs retain GET-form submission and `formAction` CSV/JSON/TXT routes without changing server-side filtering.
- Supports arrow keys, Home/End, Enter/Space, Escape, outside click, focus return, and listbox accessibility semantics.
- Updated source-contract assertions and added three regression checks.
- No database migrations or dependencies; existing environment files are not included.
