export type ExamKind = "SAT" | "ACT";
export type PracticeTopic = { id: string; title: string; exam: ExamKind | "Both"; minutes: number; category: string };
export const PRACTICE_TOPICS: readonly PracticeTopic[] = [
  { id: "sat-reading", title: "Reading comprehension and evidence", exam: "SAT", minutes: 35, category: "Reading" },
  { id: "sat-writing", title: "Grammar, punctuation and expression", exam: "SAT", minutes: 30, category: "Writing" },
  { id: "sat-algebra", title: "Algebra and linear equations", exam: "SAT", minutes: 40, category: "Math" },
  { id: "sat-advanced", title: "Advanced math and nonlinear functions", exam: "SAT", minutes: 40, category: "Math" },
  { id: "sat-data", title: "Data analysis and problem solving", exam: "SAT", minutes: 35, category: "Math" },
  { id: "sat-geometry", title: "Geometry and trigonometry", exam: "SAT", minutes: 35, category: "Math" },
  { id: "act-english", title: "English conventions and rhetorical skills", exam: "ACT", minutes: 35, category: "English" },
  { id: "act-math", title: "Math reasoning and problem solving", exam: "ACT", minutes: 45, category: "Math" },
  { id: "act-reading", title: "Reading interpretation and inference", exam: "ACT", minutes: 40, category: "Reading" },
  { id: "act-science", title: "Optional science data interpretation", exam: "ACT", minutes: 40, category: "Science" },
  { id: "both-review", title: "Review mistakes and build an error log", exam: "Both", minutes: 25, category: "Review" },
  { id: "both-timed", title: "Timed practice and pacing reflection", exam: "Both", minutes: 30, category: "Strategy" },
];
export type PracticePlan = { exam: ExamKind; days: number; dailyCapacity: number; selectedTopics: PracticeTopic[]; sessions: { day: number; topics: { id: string; title: string; minutes: number }[]; totalMinutes: number }[]; totalMinutes: number; unscheduledMinutes: number };
export function buildPracticePlan(exam: ExamKind, topicIds: readonly string[], days = 7, dailyCapacity = 60): PracticePlan {
  const safeDays = Number.isFinite(days) ? Math.max(1, Math.min(30, Math.floor(days))) : 7;
  const safeCapacity = Number.isFinite(dailyCapacity) ? Math.max(15, Math.min(240, Math.floor(dailyCapacity))) : 60;
  const ids = new Set(topicIds);
  const selectedTopics = PRACTICE_TOPICS.filter(topic => ids.has(topic.id) && (topic.exam === exam || topic.exam === "Both"));
  const sessions = Array.from({ length: safeDays }, (_, index) => ({ day: index + 1, topics: [] as { id: string; title: string; minutes: number }[], totalMinutes: 0 }));
  let unscheduledMinutes = 0;
  for (const topic of selectedTopics) {
    let remaining = topic.minutes;
    for (const session of sessions) {
      const available = safeCapacity - session.totalMinutes;
      if (available <= 0) continue;
      const minutes = Math.min(remaining, available);
      if (minutes > 0) { session.topics.push({ id: topic.id, title: topic.title, minutes }); session.totalMinutes += minutes; remaining -= minutes; }
      if (!remaining) break;
    }
    unscheduledMinutes += remaining;
  }
  return { exam, days: safeDays, dailyCapacity: safeCapacity, selectedTopics, sessions, totalMinutes: sessions.reduce((sum, day) => sum + day.totalMinutes, 0), unscheduledMinutes };
}
export function formatPracticePlanText(plan: PracticePlan): string {
  return [`${plan.exam} PRACTICE PLANNER`, `Duration: ${plan.days} days | Capacity: ${plan.dailyCapacity} min/day`, `Scheduled: ${plan.totalMinutes} min | Unscheduled: ${plan.unscheduledMinutes} min`, "", ...plan.sessions.flatMap(day => [`Day ${day.day}: ${day.totalMinutes} min`, ...(day.topics.length ? day.topics.map(topic => `- ${topic.title}: ${topic.minutes} min`) : ["- Rest / independent review"]) ]), "", "This is a suggested study plan, not a diagnostic score or a completed practice record."].join("\n");
}
function csvCell(value: string | number) { const raw = String(value); const safe = /^[\s]*[=+@-]/.test(raw) ? `'${raw}` : raw; return `"${safe.replace(/"/g, '""')}"`; }
export function formatPracticePlanCsv(plan: PracticePlan): string {
  return ["day,exam,topic,minutes", ...plan.sessions.flatMap(day => day.topics.map(topic => [day.day, plan.exam, topic.title, topic.minutes].map(csvCell).join(",")))].join("\r\n");
}
