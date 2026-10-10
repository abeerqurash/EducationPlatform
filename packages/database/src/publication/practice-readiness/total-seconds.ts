import {type Attempt,valid,pct,ordered} from "./shared";
export function totalSeconds(rows:readonly Attempt[]):number{const v=valid(rows);return v.reduce((s,r)=>s+r.durationSeconds,0);}
