import {valid,pct,ordered,type Attempt} from "./shared";
/** Deterministic educational metric for validated practice history. */
export function weightedAccuracy(rows:readonly Attempt[]):number{const v=valid(rows);return pct(v.reduce((s,r)=>s+r.correct,0),v.reduce((s,r)=>s+r.total,0));}
