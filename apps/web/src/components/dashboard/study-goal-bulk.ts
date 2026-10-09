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

/** Select the first matching goals in the current sort order, across every page. */
export function selectMatchingGoals(eligible: readonly string[], limit = MAX_BULK_GOALS): string[] {
  const safeLimit = Number.isSafeInteger(limit) ? Math.max(0, Math.min(MAX_BULK_GOALS, limit)) : MAX_BULK_GOALS;
  return [...new Set(eligible)].slice(0, safeLimit);
}

/** Number of matching goals omitted because of the bulk safety limit. */
export function bulkSelectionRemainder(matchingCount: number): number {
  return Math.max(0, matchingCount - MAX_BULK_GOALS);
}

/** Toggle all eligible members of a deadline group without disturbing selections in other groups. */
export function toggleBulkGoalGroup(selected: readonly string[], groupIds: readonly string[], checked: boolean, limit = MAX_BULK_GOALS): string[] {
  const safeLimit = Number.isSafeInteger(limit) ? Math.max(0, Math.min(MAX_BULK_GOALS, limit)) : MAX_BULK_GOALS;
  const group = new Set(groupIds);
  const current = [...new Set(selected)].slice(0, safeLimit);
  if (!checked) return current.filter(id => !group.has(id));
  const result = [...current];
  for (const id of group) {
    if (result.length >= safeLimit) break;
    if (!result.includes(id)) result.push(id);
  }
  return result;
}

/** Returns the number of unselected group goals, including those beyond the batch limit. */
export function remainingGroupGoals(selected: readonly string[], groupIds: readonly string[]): number {
  const chosen = new Set(selected);
  return new Set(groupIds).size - [...new Set(groupIds)].filter(id => chosen.has(id)).length;
}
