import {valid,pct,ordered,type Attempt} from "./shared";
/** Deterministic educational metric for validated practice history. */
export function perfectSessions(rows:readonly Attempt[]):number{const v=valid(rows);return v.filter(r=>r.correct===r.total).length;}
