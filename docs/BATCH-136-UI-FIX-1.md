# Batch 136 UI Fix 1 — Dashboard action visual system

Applies the existing EducationPlatform rounded, neutral dashboard visual language to selection, filtering, export, navigation and destructive controls.

- Reusable `ThemedCheckbox` uses a native accessible input with a visually custom focusable treatment and keyboard support.
- Shared `dashboardAction`, `dashboardActionPrimary`, `dashboardActionDanger` styles standardize hover/focus/disabled states.
- Study Goal workspace uses themed checkboxes for single, page and deadline-group selection; filters, cross-page selection, clearing, expand/collapse and exports use consistent pill buttons.
- Test Prep history export and saved-result navigation links use themed pill links instead of underlined violet text.
- Confirmation dialog's Delete trigger uses a restrained destructive pill instead of underlined red text.
- Adds static design regression tests.

No database migration, API change or new dependency. Keep `.env.local` on local installation. Run database/calculator tests, typecheck, lint and build after extraction.

**Future standard:** no raw default checkboxes or bare underlined action links in new dashboard UI; prefer shared themed controls. Reserve inline text links for prose, not primary actions.
