import {valid,pct,ordered,type Attempt} from "./shared";
/** Deterministic educational metric for validated practice history. */
export function answeredCount(rows:readonly Attempt[]):number{const v=valid(rows);return v.reduce((s,r)=>s+r.answered,0);}
