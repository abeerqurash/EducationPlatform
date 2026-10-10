import {type Attempt,valid,pct,ordered} from "./shared";
export function weightedAccuracy(rows:readonly Attempt[]):number{const v=valid(rows);return pct(v.reduce((s,r)=>s+r.correct,0),v.reduce((s,r)=>s+r.total,0));}
