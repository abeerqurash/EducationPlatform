import { type Attempt } from "./shared";
export function practicePace(entries:readonly Attempt[]) {const seconds=entries.reduce((n,a)=>n+a.durationSeconds,0);const questions=entries.reduce((n,a)=>n+a.total,0);return {totalMinutes:Math.round(seconds/60),secondsPerQuestion:questions?Math.round(seconds/questions):0};}
