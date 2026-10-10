import {valid,pct,ordered,type Attempt} from "./shared";
/** Deterministic educational metric for validated practice history. */
export function recentAccuracy(rows:readonly Attempt[]):number{const v=valid(rows);const a=ordered(v).slice(-5);return pct(a.reduce((s,r)=>s+r.correct,0),a.reduce((s,r)=>s+r.total,0));}
