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

/** Keep only currently eligible goals, retaining order and the server batch limit. */
export function reconcileBulkSelection(selected: readonly string[], eligible: readonly string[]): string[] {
  const allowed = new Set(eligible);
  return [...new Set(selected)].filter(id => allowed.has(id)).slice(0, MAX_BULK_GOALS);
}

/** A readable confirmation preview without exposing goal notes. */
export function describeBulkSelection(titles: readonly string[], operation: GoalBulkOperation): string {
  const verb = operation === "archive" ? "Archive" : operation === "reopen" ? "Reopen" : "Complete";
  const preview = titles.slice(0, 5).map(title => `• ${title.slice(0, 100)}`).join("\n");
  const remainder = titles.length > 5 ? `\n…and ${titles.length - 5} more.` : "";
  return `${verb} ${titles.length} selected goal(s)?\n\n${preview}${remainder}\n\nThis updates saved goals in your account.`;
}
