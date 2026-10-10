import {type Attempt,valid,pct,ordered} from "./shared";
export function averageSeconds(rows:readonly Attempt[]):number{const v=valid(rows);return v.length?Math.round(v.reduce((s,r)=>s+r.durationSeconds,0)/v.length):0;}
