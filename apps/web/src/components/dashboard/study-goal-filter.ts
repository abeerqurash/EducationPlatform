export type GoalWorkspaceFilter = { query: string; status: string; deadline: string; sort: string };
export type FilterableGoal = { id: string; title: string; description: string | null; completedAt: Date | string | null; targetDate: string | null; targetMinutes: number | null };
/** Pure, immutable filtering of the account-scoped goals already loaded for the dashboard. */
export function filterAndSortGoals<T extends FilterableGoal>(goals: readonly T[], filter: GoalWorkspaceFilter, todayUtc: string): T[] {
  const today = /^\d{4}-\d{2}-\d{2}$/.test(todayUtc) ? todayUtc : "1970-01-01";
  const nextWeek = new Date(`${today}T00:00:00.000Z`);
  nextWeek.setUTCDate(nextWeek.getUTCDate() + 7);
  const cutoff = nextWeek.toISOString().slice(0, 10);
  const term = filter.query.trim().toLocaleLowerCase();
  return goals.filter(goal => {
    if (term && !`${goal.title} ${goal.description ?? ""}`.toLocaleLowerCase().includes(term)) return false;
    if (filter.status === "open" && goal.completedAt) return false;
    if (filter.status === "completed" && !goal.completedAt) return false;
    if (filter.deadline === "unscheduled") return !goal.targetDate && !goal.completedAt;
    if (filter.deadline !== "all" && (goal.completedAt || !goal.targetDate)) return false;
    if (filter.deadline === "overdue") return goal.targetDate! < today;
    if (filter.deadline === "today") return goal.targetDate === today;
    if (filter.deadline === "upcoming") return goal.targetDate! > today && goal.targetDate! <= cutoff;
    return true;
  }).sort((a, b) => {
    if (filter.sort === "title") return a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
    if (filter.sort === "minutes") return (b.targetMinutes ?? 0) - (a.targetMinutes ?? 0) || a.title.localeCompare(b.title);
    return (a.targetDate ?? "9999-12-31").localeCompare(b.targetDate ?? "9999-12-31") || a.title.localeCompare(b.title);
  });
}
