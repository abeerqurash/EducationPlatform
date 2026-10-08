# Batch 99 Fix 2 — Study plan date calendar

The Study plan create-goal and edit-goal forms now use the shared themed calendar instead of native browser date inputs. The new client wrapper submits the original `targetDate` field as an ISO `YYYY-MM-DD` string using a hidden input, so existing server actions and persistence remain unchanged. The reusable dashboard calendar supports clearing a selected date.

No migrations or dependencies were added. Regression contract tests cover both forms and the field contract.
