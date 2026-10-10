import {type Attempt,valid,pct,ordered} from "./shared";
export function totalMinutes(rows:readonly Attempt[]):number{const v=valid(rows);return Math.round(v.reduce((s,r)=>s+r.durationSeconds,0)/60);}
