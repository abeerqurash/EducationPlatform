import {valid,pct,ordered,type Attempt} from "./shared";
/** Deterministic educational metric for validated practice history. */
export function unansweredCount(rows:readonly Attempt[]):number{const v=valid(rows);return v.reduce((s,r)=>s+r.total-r.answered,0);}
