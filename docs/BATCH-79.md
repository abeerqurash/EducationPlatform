# Batch 79 — Calculator save workflow + live dashboard activity

Batch 79 completes the first end-to-end customer data loop created by Batch 78.

## All registry calculators
All eight calculator types currently routed through `CalculatorRenderer` are
wrapped once by `CalculatorSaveBridge`: GPA, Grade, Final Grade, Percentage,
Average, Percentage Change, Weighted Average and Digital SAT.

The bridge does not modify formulas or calculation state. It observes the
existing result region and only exposes `Save result` after the calculator has
a non-empty valid result. Input values and the rendered result summary are
captured at that moment and passed to the authenticated Batch 78 Server Action.
Changing inputs invalidates the captured result because the calculators already
return their result region to the established empty state.

The public tool page supplies tool slug/name from its server-owned presentation
definition rather than trusting user-entered identity.

## Dashboard
The overview now uses real persisted data for:
- Saved results count
- Distinct tools used
- Up to three recent saved results

`My tools` is promoted from a placeholder to an account-derived page based on
the student's saved calculator activity.

## Architecture
Persistence remains centralized in the Batch 78 repository/Server Action.
Individual calculator formulas are untouched and no duplicated database writes
were added to calculator components.

No new migration is required for Batch 79.
