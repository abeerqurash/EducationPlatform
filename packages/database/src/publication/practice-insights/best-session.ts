import { type Attempt, percent } from "./shared";
export function bestSession(entries:readonly Attempt[]) {return [...entries].sort((a,b)=>percent(b.correct,b.total)-percent(a.correct,a.total)||b.total-a.total)[0]??null;}
