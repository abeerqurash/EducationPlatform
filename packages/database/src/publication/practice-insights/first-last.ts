import { type Attempt, byDate, percent } from "./shared";
export function firstLastChange(entries:readonly Attempt[]) {const ordered=[...entries].sort(byDate);if(ordered.length<2)return null;return percent(ordered[ordered.length-1].correct,ordered[ordered.length-1].total)-percent(ordered[0].correct,ordered[0].total);}
