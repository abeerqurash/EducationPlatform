import { type Attempt, byDate, percent, dayKey } from "./shared";
export function accuracyTrend(entries:readonly Attempt[]) {return [...entries].sort(byDate).map((a,i)=>({session:i+1,date:dayKey(a.createdAt),accuracy:percent(a.correct,a.total)}));}
