import { type Attempt, byDate } from "./shared";
export function recentSessions(entries:readonly Attempt[],limit=5) {return [...entries].sort((a,b)=>byDate(b,a)).slice(0,Math.max(0,Math.floor(limit)));}
