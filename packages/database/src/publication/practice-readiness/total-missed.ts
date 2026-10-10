import {type Attempt,valid,pct,ordered} from "./shared";
export function totalMissed(rows:readonly Attempt[]):number{const v=valid(rows);return v.reduce((s,r)=>s+r.total-r.correct,0);}
