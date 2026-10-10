import {type Attempt,valid,pct,ordered} from "./shared";
export function averageAccuracy(rows:readonly Attempt[]):number{const v=valid(rows);return v.length?Math.round(v.reduce((s,r)=>s+pct(r.correct,r.total),0)/v.length):0;}
