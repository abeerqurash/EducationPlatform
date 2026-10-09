import { type Attempt, percent } from "./shared";
export function completionRate(entries:readonly Attempt[]) {const total=entries.reduce((n,a)=>n+a.total,0);const answered=entries.reduce((n,a)=>n+a.answered,0);return {answered,total,rate:percent(answered,total)};}
