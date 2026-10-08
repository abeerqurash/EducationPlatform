export type GoalBulkOperation = "complete" | "reopen" | "archive";
export const MAX_BULK_GOALS = 50;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Reject malformed, duplicate, or oversized bulk selections before database writes. */
export function validateBulkGoalIds(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_BULK_GOALS) return null;
  if (!value.every(item => typeof item === "string" && uuid.test(item))) return null;
  const ids = value as string[];
  return new Set(ids).size === ids.length ? ids : null;
}

export function bulkSelectionOnPage(selected: readonly string[], pageIds: readonly string[]): boolean {
  return pageIds.length > 0 && pageIds.every(id => selected.includes(id));
}
