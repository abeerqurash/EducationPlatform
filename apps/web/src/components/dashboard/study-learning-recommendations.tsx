import { summarizeLearningRecommendations, type LearningDay } from "@/app/dashboard/progress/learning-recommendations";

export function StudyLearningRecommendations({ days, benchmark = 30 }: { days: LearningDay[]; benchmark?: number }) {
  const report = summarizeLearningRecommendations(days, benchmark);
  return <section aria-label="Personal study recommendations" className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm font-extrabold text-slate-950">Suggestions from your study history</h3>
      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">{report.observedDays} UTC days reviewed</span>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        ["Recorded minutes", report.totalMinutes],
        ["Active days", report.activeDays],
        ["Benchmark days", report.benchmarkDays],
        ["Avg. active day", `${report.averageActiveMinutes} min`],
      ].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 text-xl font-extrabold tabular-nums text-slate-950">{value}</p></div>)}
    </div>
    <div className="grid gap-3 lg:grid-cols-3">
      {report.recommendations.map(item => <article key={item.id} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-bold ${item.priority === "high" ? "bg-amber-50 text-amber-800" : item.priority === "positive" ? "bg-emerald-50 text-emerald-800" : "bg-violet-50 text-violet-700"}`}>{item.priority === "positive" ? "On track" : "Study suggestion"}</span>
        <h4 className="mt-3 text-sm font-extrabold text-slate-950">{item.title}</h4>
        <p className="mt-2 flex-1 text-xs leading-5 text-slate-600">{item.detail}</p>
        <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-bold text-slate-800">Next step: {item.action}</p>
      </article>)}
    </div>
    <p className="text-xs leading-5 text-slate-500">These are informational suggestions derived only from recorded activity in the selected period. They do not measure learning outcomes, automatically track time, or replace educator guidance.</p>
  </section>;
}
