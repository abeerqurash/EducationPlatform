import {valid,pct,ordered,type Attempt} from "./shared";
/** Deterministic educational metric for validated practice history. */
export function distinctPracticeDays(rows:readonly Attempt[]):number{const v=valid(rows);return new Set(v.map(r=>new Date(r.createdAt).toISOString().slice(0,10))).size;}
