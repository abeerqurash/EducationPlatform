import type { GoalWorkspaceInsights } from "./study-goal-workspace-insights";

function duration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function StudyGoalInsightsPanel({ insights, onFocus }: {
  insights: GoalWorkspaceInsights;
  onFocus: (deadline: string, status: string) => void;
}) {
  const metrics = [
    { label: "Matching goals", value: String(insights.total) },
    { label: "Completed", value: `${insights.completed} (${insights.completionRate}%)` },
    { label: "Still open", value: String(insights.open) },
    { label: "Planned time", value: duration(insights.plannedMinutes) },
    { label: "Time in open goals", value: duration(insights.remainingMinutes) },
    { label: "Next deadline", value: insights.nextDeadline ?? "Not scheduled" },
  ];
  return (
    <section aria-label="Insights for matching study goals" className="mb-5 rounded-2xl border border-[#dfe0d5] bg-[#f7f8f2] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-extrabold text-[#171912]">Matching goal insights</h2>
        <p className="text-xs text-slate-600">Updates with your search and filters</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map(metric => <div key={metric.label} className="rounded-xl border border-[#e5e6dc] bg-white p-3"><p className="text-xs text-slate-500">{metric.label}</p><p className="mt-1 text-lg font-extrabold tabular-nums text-[#171912]">{metric.value}</p></div>)}
      </div>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Deadline quick filters">
        {[
          { label: "Overdue", value: insights.overdue, deadline: "overdue" },
          { label: "Due today", value: insights.dueToday, deadline: "today" },
          { label: "Next 7 days", value: insights.dueNextSevenDays, deadline: "upcoming" },
          { label: "Unscheduled", value: insights.unscheduled, deadline: "unscheduled" },
        ].map(item => <button key={item.deadline} type="button" onClick={() => onFocus(item.deadline, "open")} className="min-h-[44px] rounded-full border border-[#dfe0d5] bg-white px-4 text-xs font-bold text-[#171912] transition hover:border-[#171912] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171912]">{item.label}: {item.value}</button>)}
      </div>
    </section>
  );
}
