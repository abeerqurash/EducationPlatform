import {valid,pct,ordered,type Attempt} from "./shared";
/** Deterministic educational metric for validated practice history. */
export function improvementPoints(rows:readonly Attempt[]):number{const v=valid(rows);const a=ordered(v);return a.length<2?0:pct(a[a.length-1].correct,a[a.length-1].total)-pct(a[0].correct,a[0].total);}
