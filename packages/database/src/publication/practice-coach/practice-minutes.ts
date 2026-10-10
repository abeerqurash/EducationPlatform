import {valid,pct,ordered,type Attempt} from "./shared";
/** Deterministic educational metric for validated practice history. */
export function practiceMinutes(rows:readonly Attempt[]):number{const v=valid(rows);return Math.round(v.reduce((s,r)=>s+r.durationSeconds,0)/60);}
