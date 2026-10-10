import {valid,pct,ordered,type Attempt} from "./shared";
/** Deterministic educational metric for validated practice history. */
export function sessionCount(rows:readonly Attempt[]):number{const v=valid(rows);return v.length;}
