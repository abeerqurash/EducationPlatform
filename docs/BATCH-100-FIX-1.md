# Batch 100 Fix 1

- Move calendar month synchronization into the date picker open click handler, avoiding synchronous React state updates in effects while retaining selected-month behavior.
- Update date-preset contract to assert the shared filter pill handles `aria-current` and that the page passes the correct active state.
- No database migrations, dependencies or other runtime behavior changed.
