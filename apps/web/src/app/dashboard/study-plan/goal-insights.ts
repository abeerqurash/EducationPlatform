/** Pure, UTC-based goal health calculations. No extra queries or persisted state. */
export type GoalInsightRecord = {
  id: string;
  title: string;
  targetDate: string | null;
  targetMinutes: number | null;
  completedAt: Date | string | null;
};

export function summarizeGoalHealth(goals: readonly GoalInsightRecord[], todayUtc: string) {
  const today = /^\d{4}-\d{2}-\d{2}$/.test(todayUtc) ? todayUtc : "1970-01-01";
  const open = goals.filter((goal) => !goal.completedAt);
  const completed = goals.length - open.length;
  const overdue = open.filter((goal) => goal.targetDate && goal.targetDate < today);
  const dueToday = open.filter((goal) => goal.targetDate === today);
  const inSevenDays = new Date(`${today}T00:00:00.000Z`);
  inSevenDays.setUTCDate(inSevenDays.getUTCDate() + 7);
  const cutoff = inSevenDays.toISOString().slice(0, 10);
  const upcoming = open.filter((goal) => goal.targetDate && goal.targetDate > today && goal.targetDate <= cutoff);
  const scheduled = open.filter((goal) => goal.targetDate);
  const plannedMinutes = open.reduce((sum, goal) => sum + (Number.isFinite(goal.targetMinutes) && (goal.targetMinutes ?? 0) > 0 ? goal.targetMinutes! : 0), 0);
  const deadlines = [...scheduled].sort((a, b) => (a.targetDate ?? "").localeCompare(b.targetDate ?? "") || a.title.localeCompare(b.title));
  return {
    total: goals.length,
    completed,
    open: open.length,
    completionRate: goals.length ? Math.round((completed / goals.length) * 100) : 0,
    overdue: overdue.length,
    dueToday: dueToday.length,
    upcoming: upcoming.length,
    unscheduled: open.length - scheduled.length,
    plannedMinutes,
    deadlines: deadlines.slice(0, 8).map((goal) => ({
      id: goal.id,
      title: goal.title,
      targetDate: goal.targetDate!,
      status: goal.targetDate! < today ? "Overdue" : goal.targetDate === today ? "Due today" : "Upcoming",
    })),
  };
}
